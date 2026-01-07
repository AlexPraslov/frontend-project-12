import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useRef } from 'react';
import { fetchMessages, addMessage } from '../../store/slices/messagesSlice';
import { getSocket } from '../../socket';
import MessageForm from '../chat/MessageForm';

const MessagesList = () => {
  const dispatch = useDispatch();
  const { currentChannelId, items: channels } = useSelector((state) => state.channels);
  const { byChannelId, loading, error } = useSelector((state) => state.messages);
  
  // Ref для хранения предыдущего channelId
  const prevChannelIdRef = useRef(currentChannelId);

  // Находим текущий канал
  const currentChannel = useMemo(() => {
    return channels.find(ch => String(ch.id) === String(currentChannelId)) || { name: 'Unknown' };
  }, [channels, currentChannelId]);

  // Сообщения только для текущего канала
  const filteredMessages = useMemo(() => {
    const normalizedChannelId = String(currentChannelId);
    return byChannelId[normalizedChannelId] || [];
  }, [currentChannelId, byChannelId]);

  // Загружаем сообщения при смене канала
  useEffect(() => {
    const normalizedCurrentId = String(currentChannelId);
    const normalizedPrevId = String(prevChannelIdRef.current);
    
    if (normalizedCurrentId !== normalizedPrevId) {
      console.log('Смена канала:', normalizedPrevId, '->', normalizedCurrentId);
      dispatch(fetchMessages(currentChannelId));
      prevChannelIdRef.current = currentChannelId;
    }
  }, [currentChannelId, dispatch]);

  // WebSocket подписка на новые сообщения
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('WebSocket не инициализирован');
      return;
    }

    const handleNewMessage = (message) => {
      console.log('WebSocket: новое сообщение:', message);
      
      // Проверяем channelId сообщения
      const messageChannelId = String(message.channelId);
      
      // Добавляем сообщение в store для соответствующего канала
      dispatch(addMessage({
        channelId: messageChannelId,
        message: message
      }));
      
      console.log('Сообщение добавлено в канал:', messageChannelId);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      if (socket) {
        socket.off('newMessage', handleNewMessage);
      }
    };
  }, [dispatch]);

  if (loading && filteredMessages.length === 0) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#666'
      }}>
        Загрузка сообщений...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#dc3545'
      }}>
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок канала */}
      <div style={{ 
        padding: '15px 20px', 
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          # {currentChannel.name}
          <span style={{ 
            fontSize: '14px', 
            color: '#666',
            marginLeft: '10px'
          }}>
            ({filteredMessages.length} сообщений)
          </span>
        </h3>
      </div>

      {/* Список сообщений */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        backgroundColor: '#fff'
      }}>
        {filteredMessages.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#999',
            fontSize: '16px'
          }}>
            Нет сообщений в этом канале. Напишите первое сообщение!
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div 
              key={message.id} 
              style={{ 
                marginBottom: '15px',
                padding: '12px 15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #eee'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: '#007bff' }}>{message.username}</strong>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div style={{ fontSize: '15px', lineHeight: '1.4' }}>
                {message.body}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Форма ввода */}
      <div style={{ 
        borderTop: '1px solid #ddd', 
        padding: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <MessageForm />
      </div>
    </div>
  );
};

export default MessagesList;
