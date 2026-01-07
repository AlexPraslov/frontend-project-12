import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { fetchChannels } from '../store/slices/channelsSlice';
import ChannelsList from '../components/channels/ChannelsList';
import MessagesList from '../components/messages/MessagesList';

const MainPage = () => {
  const { logout } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Левая панель - каналы */}
      <div style={{
        width: '280px',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff'
      }}>
        <div style={{
          padding: '20px 25px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '22px', 
              fontWeight: '700',
              color: '#007bff',
              marginBottom: '5px'
            }}>
              Hexlet Chat
            </h3>
            <div style={{ fontSize: '13px', color: '#666' }}>
              Учебный проект
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a6268';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Выйти
          </button>
        </div>
        
        <div style={{
          padding: '15px 25px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
          fontSize: '13px',
          fontWeight: '600',
          color: '#495057',
          letterSpacing: '0.3px'
        }}>
          КАНАЛЫ
        </div>
        
        <ChannelsList />
      </div>

      {/* Правая панель - сообщения */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        minWidth: '0'
      }}>
        <MessagesList />
      </div>
    </div>
  );
};

export default MainPage;
