import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AddChannelModal from '../modals/AddChannelModal';
import RemoveChannelModal from '../modals/RemoveChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';
import { useTranslation } from 'react-i18next';

const ChannelDropdown = ({ channelId }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useTranslation();

  const channels = useSelector((state) => state.channels.items);
  const channel = channels.find(ch => ch.id === channelId);

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
        {/* ПРОСТАЯ КНОПКА БЕЗ ВЛОЖЕННОСТИ */}
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setDropdownOpen(!dropdownOpen);
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#6c757d',
            fontSize: '16px',
            lineHeight: '1',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>⋮</span>
        </button>

        {dropdownOpen && (
          <div 
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              zIndex: 1000,
              backgroundColor: 'white',
              border: '1px solid rgba(0,0,0,.15)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,.15)',
              minWidth: '200px',
              marginTop: '5px',
            }}
          >
            <div style={{ padding: '4px 0' }}>
              {channel.removable && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
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
                    }}
                  >
                    {t('chat.channels.dropdown.rename')}
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
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
                    }}
                  >
                    {t('chat.channels.dropdown.remove')}
                  </button>
                </>
              )}
              
              <div style={{ borderTop: '1px solid #dee2e6', margin: '4px 0' }} />
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
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
                }}
              >
                {t('chat.channels.dropdown.addChannel')}
              </button>
            </div>
          </div>
        )}
      </div>

      <AddChannelModal show={showAddModal} onHide={() => setShowAddModal(false)} />
      <RemoveChannelModal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} channelId={channelId} />
      <RenameChannelModal show={showRenameModal} onHide={() => setShowRenameModal(false)} channelId={channelId} />
    </>
  );
};

export default ChannelDropdown;
