import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../../store/slices/channelsSlice';
import AddChannelModal from '../modals/AddChannelModal';
import RemoveChannelModal from '../modals/RemoveChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';
import { useTranslation } from 'react-i18next';

const ChannelDropdown = ({ channelId }) => {
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useTranslation();

  const channels = useSelector((state) => state.channels.items);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  
  const channel = channels.find(ch => ch.id === channelId);
  const isCurrentChannel = String(channelId) === String(currentChannelId);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!channel) return null;

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 6px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#6c757d',
            fontSize: '12px',
            lineHeight: '1',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minWidth: '120px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#007bff';
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6c757d';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Управление каналом"
          title="Управление каналом"
        >
          <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '6px' }}>⋮</span>
          <span style={{ 
            fontSize: '12px',
            opacity: 0.7,
          }}>
            Управление каналом
          </span>
        </button>

        {dropdownOpen && (
          <div 
            ref={dropdownRef}
            style={{
              position: 'fixed',
              zIndex: 9999,
              backgroundColor: 'white',
              border: '1px solid rgba(0,0,0,.15)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,.15)',
              minWidth: '200px',
            }}
          >
            <div style={{ padding: '4px 0' }}>
              {!isCurrentChannel && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setCurrentChannel(channelId));
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {t('chat.channels.dropdown.switch')}
                </button>
              )}
              
              {channel.removable && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRenameModal(true);
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {t('chat.channels.dropdown.rename')}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowRemoveModal(true);
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#dc3545',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {t('chat.channels.dropdown.remove')}
                  </button>
                </>
              )}
              
              <div style={{ borderTop: '1px solid #dee2e6', margin: '4px 0' }} />
              
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(true);
                  setDropdownOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#28a745',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t('chat.channels.dropdown.addChannel')}
              </button>
            </div>
          </div>
        )}
      </div>

      <AddChannelModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
      />
      
      <RemoveChannelModal 
        show={showRemoveModal} 
        onHide={() => setShowRemoveModal(false)}
        channelId={channelId}
      />
      
      <RenameChannelModal 
        show={showRenameModal} 
        onHide={() => setShowRenameModal(false)}
        channelId={channelId}
      />
    </>
  );
};

export default ChannelDropdown;
