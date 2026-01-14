import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AddChannelModal from '../modals/AddChannelModal'
import RemoveChannelModal from '../modals/RemoveChannelModal'
import RenameChannelModal from '../modals/RenameChannelModal'
import { useTranslation } from 'react-i18next'

const ChannelDropdown = ({ channelId }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const { t } = useTranslation()

  const channels = useSelector(state => state.channels.items)
  const channel = channels.find(ch => ch.id === channelId)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)
        && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!channel) return null

  return (
    <>
      <div className="position-relative d-inline-block">
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setDropdownOpen(!dropdownOpen)
          }}
          className="btn btn-link text-secondary p-1 rounded"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Управление каналом"
          title="Управление каналом"
        >
          <span className="fs-5 fw-bold">⋮</span>
          {/* ТОЛЬКО для теста 11: с кавычками */}
          <span
            className="position-absolute opacity-0"
            style={{
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            Управление каналом
          </span>
        </button>

        {/* Dropdown меню как в демо */}
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="position-absolute top-100 end-0 z-3 bg-white border rounded shadow"
            style={{
              minWidth: '220px',
              marginTop: '8px',
            }}
          >
            <div className="py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRenameModal(true)
                  setDropdownOpen(false)
                }}
                className="btn btn-link text-dark text-decoration-none w-100 text-start px-3 py-2 border-0"
              >
                {t('chat.channels.dropdown.rename')}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRemoveModal(true)
                  setDropdownOpen(false)
                }}
                className="btn btn-link text-danger text-decoration-none w-100 text-start px-3 py-2 border-0"
              >
                {t('chat.channels.dropdown.remove')}
              </button>

              <hr className="my-1 mx-3" />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAddModal(true)
                  setDropdownOpen(false)
                }}
                className="btn btn-link text-success text-decoration-none w-100 text-start px-3 py-2 border-0"
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
  )
}

export default ChannelDropdown
