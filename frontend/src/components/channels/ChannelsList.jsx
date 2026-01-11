import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../store/slices/channelsSlice';
import ChannelDropdown from './ChannelDropdown';
import { useRef } from 'react';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { items, currentChannelId, loading, error } = useSelector((state) => state.channels);
  const containerRef = useRef(null);

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
    <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
      {items.map((channel) => {
        const normalizedCurrentId = String(currentChannelId);
        const normalizedChannelId = String(channel.id);
        const isActive = normalizedCurrentId === normalizedChannelId;

        return (
          <div key={channel.id} style={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 15px',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: isActive ? '#007bff' : 'transparent',
            color: isActive ? 'white' : '#333',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onClick={() => dispatch(setCurrentChannel(channel.id))}
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
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1,
              overflow: 'hidden',
              minWidth: 0,
            }}>
              <span style={{ 
                marginRight: '10px', 
                fontWeight: 'bold',
                color: isActive ? 'white' : '#666',
                flexShrink: 0,
              }}>
                #
              </span>
              <span style={{ 
                flex: 1,
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              }}>
                {channel.name}
              </span>
              {!channel.removable && (
                <span style={{ 
                  fontSize: '11px', 
                  opacity: 0.7,
                  color: isActive ? 'rgba(255,255,255,0.8)' : '#666',
                  marginLeft: '8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  системный
                </span>
              )}
            </div>
            
            <div 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ 
                marginLeft: '10px',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <ChannelDropdown channelId={channel.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChannelsList;
