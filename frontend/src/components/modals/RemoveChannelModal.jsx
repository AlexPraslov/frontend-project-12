import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeChannel } from '../../store/slices/channelsSlice';
import { removeChannelMessages } from '../../store/slices/messagesSlice';

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const channels = useSelector((state) => state.channels.items);
  
  const channel = channels.find(ch => ch.id === channelId);
  
  const handleSubmit = async () => {
    if (!channel || !channel.removable) return;
    
    setSubmitting(true);
    try {
      await dispatch(removeChannel(channelId)).unwrap();
      dispatch(removeChannelMessages(channelId));
      onHide();
    } catch (error) {
      console.error('Ошибка при удалении канала:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show || !channel) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}>
        {/* Заголовок */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#212529',
          }}>
            Удалить канал
          </h3>
        </div>

        {/* Содержимое */}
        <div style={{ padding: '24px' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#495057' }}>
            Уверены, что хотите удалить канал <strong>#{channel.name}</strong>?
          </p>
          <p style={{ 
            margin: '0 0 20px 0', 
            fontSize: '13px', 
            color: '#dc3545',
            padding: '12px',
            backgroundColor: '#f8d7da',
            borderRadius: '6px',
            border: '1px solid #f5c6cb',
          }}>
            ⚠️ Все сообщения в этом канале будут удалены безвозвратно!
          </p>
          {!channel.removable && (
            <div style={{ 
              padding: '12px',
              backgroundColor: '#fff3cd',
              borderRadius: '6px',
              border: '1px solid #ffeaa7',
              fontSize: '13px',
              color: '#856404',
              marginBottom: '20px',
            }}>
              ⚠️ Этот канал нельзя удалить (системный канал)
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
        }}>
          <button
            type="button"
            onClick={onHide}
            disabled={submitting}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              opacity: submitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = '#5a6268';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = '#6c757d';
              }
            }}
          >
            Отменить
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!channel.removable || submitting}
            style={{
              padding: '8px 20px',
              backgroundColor: submitting ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: (!channel.removable || submitting) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              opacity: !channel.removable ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (channel.removable && !submitting) {
                e.currentTarget.style.backgroundColor = '#c82333';
              }
            }}
            onMouseLeave={(e) => {
              if (channel.removable && !submitting) {
                e.currentTarget.style.backgroundColor = '#dc3545';
              }
            }}
          >
            {submitting ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveChannelModal;
