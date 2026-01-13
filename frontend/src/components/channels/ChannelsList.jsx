import { useSelector, useDispatch } from 'react-redux'
import { setCurrentChannel } from '../../store/slices/channelsSlice'
import ChannelDropdown from './ChannelDropdown'
import { useTranslation } from 'react-i18next'

const ChannelsList = () => {
  const dispatch = useDispatch()
  const { items, currentChannelId, loading, error } = useSelector((state) => state.channels)
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="text-center text-muted p-4">
        {t('common.loading')}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-danger p-4">
        {t('errors.loadChannels')}
      </div>
    )
  }

  return (
    <div className="overflow-visible" style={{ flex: 1 }}>
      {items.map((channel) => {
        const normalizedCurrentId = String(currentChannelId)
        const normalizedChannelId = String(channel.id)
        const isActive = normalizedCurrentId === normalizedChannelId

        return (
          <div
            key={channel.id}
            className="position-relative"
            style={{
              minHeight: '44px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => dispatch(setCurrentChannel(channel.id))}
              className={`d-flex align-items-center px-3 py-2 border-0 text-start flex-grow-1 h-100 ${isActive ? 'bg-primary text-white' : 'bg-white'}`}
              style={{
                cursor: 'pointer',
                minHeight: '44px',
                flex: '1 1 auto',
                minWidth: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#f8f9fa'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              <span className={`me-2 ${isActive ? 'text-white' : 'text-muted'}`}>
                #
              </span>
              <span className="text-truncate" style={{ fontSize: '14px' }}>
                {channel.name}
              </span>
            </button>

            {channel.removable && (
              <div
                className="flex-shrink-0"
                style={{
                  width: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <ChannelDropdown channelId={channel.id} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ChannelsList
