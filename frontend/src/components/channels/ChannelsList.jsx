import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../store/slices/channelsSlice';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { items, currentChannelId, loading, error } = useSelector((state) => state.channels);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
        Загрузка каналов...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {items.map((channel) => {
        const normalizedCurrentId = String(currentChannelId);
        const normalizedChannelId = String(channel.id);
        const isActive = normalizedCurrentId === normalizedChannelId;

        return (
          <div
            key={channel.id}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            style={{
              padding: '12px 15px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: isActive ? '#007bff' : 'transparent',
              color: isActive ? 'white' : '#333',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', fontWeight: 'bold' }}>#</span>
              <span style={{ flex: 1, fontSize: '14px' }}>{channel.name}</span>
              {!channel.removable && (
                <span style={{ 
                  fontSize: '11px', 
                  opacity: 0.7,
                  color: isActive ? 'rgba(255,255,255,0.8)' : '#666'
                }}>
                  системный
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChannelsList;
