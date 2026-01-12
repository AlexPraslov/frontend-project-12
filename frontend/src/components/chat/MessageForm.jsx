import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { getSocket } from '../../socket';
import { filterProfanity, hasProfanity } from '../../utils/profanityFilter';
import { notifyMessageSent, notifySendMessageError, showWarning } from '../../utils/notifications';
import { useTranslation } from 'react-i18next';
import { Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { Send, Wifi, WifiOff } from 'react-bootstrap-icons';

const MessageForm = () => {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { username } = useAuth();

  const { currentChannelId } = useSelector((state) => state.channels);
  
  // Получаем состояние соединения из socket
  const socket = getSocket();
  const connectionStatus = socket?.connected ? 'connected' : 'disconnected';

  const sendMessageViaHTTP = async (messageData, retries = 3) => {
    try {
      const token = localStorage.getItem('token');
      
      const filteredBody = filterProfanity(messageData.body);
      const hadProfanity = hasProfanity(messageData.body);
      
      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...messageData,
          body: filteredBody,
          username: username || 'user'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (hadProfanity) {
        showWarning('notifications.warning.profanity');
      }
      
      notifyMessageSent();
      return data;

    } catch (err) {
      console.error('HTTP error:', err);

      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return sendMessageViaHTTP(messageData, retries - 1);
      }

      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageText.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const messageData = {
        body: messageText.trim(),
        channelId: Number(currentChannelId),
      };

      await sendMessageViaHTTP(messageData);
      setMessageText('');

    } catch (err) {
      const errorMessage = err.message || t('errors.sendMessage');
      setError(`${errorMessage}. ${t('errors.sendMessage')}`);
      notifySendMessageError();

      const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || '[]');
      unsentMessages.push({
        text: messageText,
        channelId: currentChannelId,
        timestamp: Date.now(),
        attempts: 1
      });
      localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages));

    } finally {
      setSending(false);
    }
  };

  const retryUnsentMessages = async () => {
    const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || '[]');
    if (unsentMessages.length === 0) return;

    const successful = [];
    const failed = [];

    for (const msg of unsentMessages) {
      try {
        const messageData = {
          body: msg.text,
          channelId: Number(msg.channelId),
        };

        await sendMessageViaHTTP(messageData);
        successful.push(msg);
      } catch (err) {
        console.error('Failed to resend saved message:', err);
        failed.push({ ...msg, attempts: (msg.attempts || 1) + 1 });
      }
    }

    localStorage.setItem('unsentMessages', JSON.stringify(failed));

    if (successful.length > 0) {
      console.log(`Successfully resent ${successful.length} messages`);
      setError(null);
    }
  };

  const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || '[]');
  const hasUnsentMessages = unsentMessages.length > 0;

  return (
    <div>
      {/* Статус соединения */}
      <div className="d-flex align-items-center mb-2">
        <Badge 
          bg={connectionStatus === 'connected' ? 'success' : 'secondary'}
          className="d-flex align-items-center"
        >
          {connectionStatus === 'connected' ? (
            <Wifi size={12} className="me-1" />
          ) : (
            <WifiOff size={12} className="me-1" />
          )}
          {connectionStatus === 'connected' 
            ? t('chat.messages.connection.online') 
            : t('chat.messages.connection.offline')
          }
        </Badge>
      </div>

      {/* Ошибки */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
          {hasUnsentMessages && (
            <div className="mt-2">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={retryUnsentMessages}
              >
                {t('chat.messages.unsent', { count: unsentMessages.length })}
              </Button>
            </div>
          )}
        </Alert>
      )}

      {/* Форма ввода */}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={t('chat.messages.placeholder')}
            aria-label="Новое сообщение"
            disabled={sending}
            className="rounded-pill"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!messageText.trim() || sending}
            className="rounded-pill px-4"
          >
            {sending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {t('chat.messages.sending')}
              </>
            ) : (
              <>
                <Send className="me-2" />
                {t('chat.messages.send')}
              </>
            )}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
