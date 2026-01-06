import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages } from '../store/slices/messagesSlice';

const MainPage = () => {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  
  const { 
    items: channels, 
    currentChannelId,
    loading: channelsLoading, 
    error: channelsError 
  } = useSelector((state) => state.channels);
  
  const { 
    byChannelId, 
    loading: messagesLoading, 
    error: messagesError 
  } = useSelector((state) => state.messages);

  const messages = byChannelId?.[currentChannelId] || [];

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  useEffect(() => {
    if (currentChannelId) {
      dispatch(fetchMessages(currentChannelId));
    }
  }, [currentChannelId, dispatch]);

  return (
    <div>
      <h1>Чат</h1>
      <button onClick={logout}>Выйти</button>
      
      <h2>Каналы:</h2>
      {channelsLoading && <p>Загрузка каналов...</p>}
      {channelsError && <p>Ошибка: {channelsError}</p>}
      <ul>
        {(channels || []).map((channel) => (
          <li key={channel.id}>
            {channel.name} (ID: {channel.id})
          </li>
        ))}
      </ul>

      <h2>Сообщения в канале {currentChannelId}:</h2>
      {messagesLoading && <p>Загрузка сообщений...</p>}
      {messagesError && <p>Ошибка: {messagesError}</p>}
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.username}:</strong> {message.body}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
