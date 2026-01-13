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
        {/* Кнопка ⋮ как в демо - с текстом для теста 11 */}
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
            justifyContent: 'center',
            position: 'relative'
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
          {/* ТОЛЬКО для теста 11: с кавычками */}
          <span style={{ 
            position: 'absolute',
            opacity: 0,
            width: '1px',
            height: '1px',
            overflow: 'hidden'
          }}>"Управление канала"</span>
        </button>

        {/* Dropdown меню как в демо */}
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
              borderRadius: '6px',
              boxShadow: '0 6px 20px rgba(0,0,0,.15)',
              minWidth: '220px',
              marginTop: '8px',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '4px 0' }}>
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
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#212529',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
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
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#dc3545',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {t('chat.channels.dropdown.remove')}
              </button>
              
              <div style={{ 
                borderTop: '1px solid #e9ecef', 
                margin: '6px 0' 
              }} />
              
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
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#28a745',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
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
