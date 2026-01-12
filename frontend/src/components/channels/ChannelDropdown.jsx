import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../../store/slices/channelsSlice';
import AddChannelModal from '../modals/AddChannelModal';
import RemoveChannelModal from '../modals/RemoveChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';
import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';

const ChannelDropdown = ({ channelId }) => {
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const { t } = useTranslation();

  const channels = useSelector((state) => state.channels.items);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  
  const channel = channels.find(ch => ch.id === channelId);
  const isCurrentChannel = String(channelId) === String(currentChannelId);

  if (!channel) return null;

  return (
    <>
      <Dropdown onClick={(e) => e.stopPropagation()}>
        <Dropdown.Toggle 
          variant="link" 
          className="text-muted p-0 border-0"
          id={`dropdown-channel-${channelId}`}
        >
          <ThreeDotsVertical size={20} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* Убрана кнопка "Переключиться" как просил ревьюер */}
          
          {channel.removable && (
            <>
              <Dropdown.Item 
                onClick={() => setShowRenameModal(true)}
                className="text-primary"
              >
                {t('chat.channels.dropdown.rename')}
              </Dropdown.Item>
              
              <Dropdown.Item 
                onClick={() => setShowRemoveModal(true)}
                className="text-danger"
              >
                {t('chat.channels.dropdown.remove')}
              </Dropdown.Item>
            </>
          )}
          
          <Dropdown.Divider />
          
          <Dropdown.Item 
            onClick={() => setShowAddModal(true)}
            className="text-success"
          >
            {t('chat.channels.dropdown.addChannel')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <AddChannelModal show={showAddModal} onHide={() => setShowAddModal(false)} />
      <RemoveChannelModal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} channelId={channelId} />
      <RenameChannelModal show={showRenameModal} onHide={() => setShowRenameModal(false)} channelId={channelId} />
    </>
  );
};

export default ChannelDropdown;
