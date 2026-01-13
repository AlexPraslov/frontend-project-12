import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchChannels } from '../store/slices/channelsSlice'
import ChannelsList from '../components/channels/ChannelsList'
import MessagesList from '../components/messages/MessagesList'
import AddChannelModal from '../components/modals/AddChannelModal'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Button } from 'react-bootstrap'

const MainPage = () => {
  const dispatch = useDispatch()
  const [showAddModal, setShowAddModal] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(fetchChannels())
  }, [dispatch])

  return (
    <>
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Левая панель - каналы */}
          <Col md={3} lg={2} className="channels-sidebar bg-white p-0 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h6 className="mb-0 text-muted text-uppercase">
                {t('chat.channels.title')}
              </h6>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="rounded-circle px-0 py-0 d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', fontSize: '18px', fontWeight: 'bold' }}
                aria-label={t('chat.channels.addButton')}
                title={t('chat.channels.addButton')}
              >
                +
              </Button>
            </div>
            <div className="flex-grow-1">
              <ChannelsList />
            </div>
          </Col>

          {/* Правая панель - сообщения */}
          <Col md={9} lg={10} className="messages-container p-0">
            <MessagesList />
          </Col>
        </Row>
      </Container>

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />
    </>
  )
}

export default MainPage
