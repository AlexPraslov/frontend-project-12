import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { getSocket } from '../../socket';
import { filterProfanity, hasProfanity } from '../../utils/profanityFilter';
import { notifyMessageSent, notifySendMessageError, notifyOffline, notifyConnectionRestored, showWarning } from '../../utils/notifications';
import { useTranslation } from 'react-i18next';

const MessageForm = () => {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [wasDisconnected, setWasDisconnected] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const { t } = useTranslation();
  const { username } = useAuth();

  const { currentChannelId } = useSelector((state) => state.channels);

  // Мониторим состояние соединения
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConnect = () => {
      const newStatus = 'connected';
      setConnectionStatus(newStatus);
      
      // Показываем уведомление о восстановлении только если было отключение
      if (wasDisconnected) {
        notifyConnectionRestored();
        setWasDisconnected(false);
      }
    };

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
      setWasDisconnected(true);
      notifyOffline();
    };

    // Устанавливаем начальный статус
    setConnectionStatus(socket.connected ? 'connected' : 'disconnected');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [wasDisconnected]);

  const sendMessageViaHTTP = async (messageData, retries = maxRetries) => {
    try {
      const token = localStorage.getItem('token');
      
      // Фильтруем текст сообщения перед отправкой
      const filteredBody = filterProfanity(messageData.body);
      
      // Проверяем, были ли отфильтрованы нецензурные слова
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
      retryCountRef.current = 0;
      
      // Показываем предупреждение, если были нецензурные слова
      if (hadProfanity) {
        showWarning('notifications.warning.profanity');
      }
      
      notifyMessageSent();
      return data;

    } catch (err) {
      console.error('HTTP error:', err);

      if (retries > 0) {
        console.log(`HTTP retry, attempts left: ${retries - 1}`);
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
    retryCountRef.current = 0;

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

      // Сохраняем для повторной отправки
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
    <form onSubmit={handleSubmit}>
      {/* Статус соединения */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '12px',
        color: connectionStatus === 'connected' ? '#28a745' : '#6c757d'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: connectionStatus === 'connected' ? '#28a745' : '#6c757d',
          marginRight: '6px'
        }} />
        <span>
          {connectionStatus === 'connected' ? t('chat.messages.connection.online') : t('chat.messages.connection.offline')}
        </span>
      </div>

      {/* Ошибки */}
      {error && (
        <div style={{
          color: '#dc3545',
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
          {hasUnsentMessages && (
            <div style={{ marginTop: '5px' }}>
              <button
                type="button"
                onClick={retryUnsentMessages}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                {t('chat.messages.unsent', { count: unsentMessages.length })}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Форма ввода */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={t('chat.messages.placeholder')}
          style={{
            flex: 1,
            padding: '10px 15px',
            border: '1px solid #ced4da',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none'
          }}
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!messageText.trim() || sending}
          style={{
            padding: '10px 20px',
            backgroundColor: sending ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: sending ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            minWidth: '100px'
          }}
        >
          {sending ? t('chat.messages.sending') : t('chat.messages.send')}
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
