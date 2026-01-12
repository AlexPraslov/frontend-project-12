import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../store/slices/channelsSlice';
import ChannelDropdown from './ChannelDropdown';
import { useTranslation } from 'react-i18next';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { items, currentChannelId, loading, error } = useSelector((state) => state.channels);
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="text-center text-muted p-4">
        {t('common.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger p-4">
        {t('errors.loadChannels')}
      </div>
    );
  }

  return (
    <div className="overflow-auto" style={{ flex: 1 }}>
      {items.map((channel) => {
        const normalizedCurrentId = String(currentChannelId);
        const normalizedChannelId = String(channel.id);
        const isActive = normalizedCurrentId === normalizedChannelId;

        return (
          <div
            key={channel.id}
            className={`d-flex justify-content-between align-items-start px-3 py-2 border-bottom ${isActive ? 'bg-primary text-white' : 'bg-white'}`}
            style={{ 
              cursor: 'pointer',
              minHeight: '56px'
            }}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            {/* Левая часть - название канала */}
            <div 
              className="d-flex align-items-center overflow-hidden flex-grow-1"
              style={{ minWidth: 0 }}
            >
              <span className={`me-2 ${isActive ? 'text-white' : 'text-muted'}`}>
                #
              </span>
              <span className="text-truncate" style={{ fontSize: '14px' }}>
                {channel.name}
              </span>
            </div>
            
            {/* Правая часть - кнопка управления (⋮) */}
            {/* ОТДЕЛЬНО от кликабельной области канала */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="ms-2 flex-shrink-0 pt-1"
              style={{ zIndex: 2 }}
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
