import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchChannels } from '../store/slices/channelsSlice';
import ChannelsList from '../components/channels/ChannelsList';
import MessagesList from '../components/messages/MessagesList';
import AddChannelModal from '../components/modals/AddChannelModal';

const MainPage = () => {
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  return (
    <>
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 70px)',
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
            padding: '15px 25px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#495057',
              letterSpacing: '0.3px'
            }}>
              КАНАЛЫ
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#218838';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              + Добавить
            </button>
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

      <AddChannelModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
      />
    </>
  );
};

export default MainPage;
