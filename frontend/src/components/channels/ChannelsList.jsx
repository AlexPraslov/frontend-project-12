import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../store/slices/channelsSlice';
import ChannelDropdown from './ChannelDropdown';
import { ListGroup, Badge } from 'react-bootstrap';
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
    <ListGroup variant="flush" className="overflow-auto">
      {items.map((channel) => {
        const normalizedCurrentId = String(currentChannelId);
        const normalizedChannelId = String(channel.id);
        const isActive = normalizedCurrentId === normalizedChannelId;

        return (
          <ListGroup.Item
            key={channel.id}
            action
            active={isActive}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className="d-flex justify-content-between align-items-center rounded-0 border-0 border-bottom py-3 px-3"
          >
            <div className="d-flex align-items-center overflow-hidden flex-grow-1">
              <span className={`me-2 ${isActive ? 'text-white' : 'text-muted'}`}>
                #
              </span>
              <span className="text-truncate">
                {channel.name}
              </span>
            </div>
            
            <div 
              onClick={(e) => e.stopPropagation()}
              className="ms-2 flex-shrink-0"
            >
              <ChannelDropdown channelId={channel.id} />
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default ChannelsList;
