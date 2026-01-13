import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeChannel } from '../../store/slices/channelsSlice'
import { removeChannelMessages } from '../../store/slices/messagesSlice'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from 'react-bootstrap'

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const dispatch = useDispatch()
  const [submitting, setSubmitting] = useState(false)
  const channels = useSelector(state => state.channels.items)
  const { t } = useTranslation()

  const channel = channels.find(ch => ch.id === channelId)

  const handleSubmit = async () => {
    if (!channel || !channel.removable) return

    setSubmitting(true)
    try {
      await dispatch(removeChannel(channelId)).unwrap()
      dispatch(removeChannelMessages(channelId))
      onHide()
    }
    catch (error) {
      console.error('Ошибка при удалении канала:', error)
    }
    finally {
      setSubmitting(false)
    }
  }

  if (!show || !channel) return null

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channels.removeModal.title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          {t('chat.channels.removeModal.confirm')}
          {' '}
          <strong>
            #
            {channel.name}
          </strong>
          ?
        </p>
        <div className="alert alert-danger">
          ⚠️
          {' '}
          {t('chat.channels.removeModal.warning')}
        </div>
        {!channel.removable && (
          <div className="alert alert-warning">
            ⚠️
            {' '}
            {t('chat.channels.removeModal.systemChannel')}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={submitting}
        >
          {t('chat.channels.removeModal.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
          disabled={!channel.removable || submitting}
          className="btn-danger"
        >
          {submitting
            ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  {t('chat.channels.removeModal.loading')}
                </>
              )
            : t('chat.channels.removeModal.submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
