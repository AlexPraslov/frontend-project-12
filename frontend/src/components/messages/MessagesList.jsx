import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useMemo, useRef } from 'react'
import { fetchMessages, addMessage } from '../../store/slices/messagesSlice'
import { getSocket } from '../../socket'
import MessageForm from '../chat/MessageForm'
import { Card, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap'

const MessagesList = () => {
  const dispatch = useDispatch()
  const { currentChannelId, items: channels } = useSelector((state) => state.channels)
  const { byChannelId, loading, error } = useSelector((state) => state.messages)

  const prevChannelIdRef = useRef(currentChannelId)

  const currentChannel = useMemo(() => channels.find((ch) => String(ch.id) === String(currentChannelId)) || { name: 'Unknown' }, [channels, currentChannelId])

  const filteredMessages = useMemo(() => {
    const normalizedChannelId = String(currentChannelId)
    return byChannelId[normalizedChannelId] || []
  }, [currentChannelId, byChannelId])

  useEffect(() => {
    const normalizedCurrentId = String(currentChannelId)
    const normalizedPrevId = String(prevChannelIdRef.current)

    if (normalizedCurrentId !== normalizedPrevId) {
      dispatch(fetchMessages(currentChannelId))
      prevChannelIdRef.current = currentChannelId
    }
  }, [currentChannelId, dispatch])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) {
      return
    }

    const handleNewMessage = (message) => {
      const messageChannelId = String(message.channelId)
      dispatch(addMessage({
        channelId: messageChannelId,
        message,
      }))
    }

    socket.on('newMessage', handleNewMessage)

    return () => {
      if (socket) {
        socket.off('newMessage', handleNewMessage)
      }
    }
  }, [dispatch])

  if (loading && filteredMessages.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Загрузка сообщений...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <Alert variant="danger" className="w-75 text-center">
          Ошибка загрузки сообщений:
          {' '}
          {error}
        </Alert>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Заголовок канала */}
      <div className="p-3 border-bottom bg-light">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">
            <strong>
              #
              {' '}
              {currentChannel.name}
            </strong>
            <Badge bg="secondary" className="ms-2">
              {filteredMessages.length}
            </Badge>
          </h5>
        </div>
      </div>

      {/* Список сообщений */}
      <div className="flex-grow-1 overflow-auto p-3">
        {filteredMessages.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center text-muted">
              <p className="mb-1">Нет сообщений в этом канале.</p>
              <p className="mb-0">Напишите первое сообщение!</p>
            </div>
          </div>
        ) : (
          <ListGroup variant="flush">
            {filteredMessages.map((message) => (
              <ListGroup.Item key={message.id} className="border-0 mb-2 p-0">
                <Card className="message-item border-0">
                  <Card.Body className="py-2 px-3">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <Card.Title className="message-username mb-0">
                        {message.username}
                      </Card.Title>
                      <small className="message-time">
                        {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </small>
                    </div>
                    <Card.Text className="mb-0">
                      {message.body}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {/* Форма ввода */}
      <div className="border-top p-3 bg-light">
        <MessageForm />
      </div>
    </div>
  )
}

export default MessagesList
