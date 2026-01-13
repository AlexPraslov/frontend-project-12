import { io } from 'socket.io-client'

let socket = null

export const initSocket = (token) => {
  if (socket) {
    return socket
  }

  socket = io(window.location.origin, {
    auth: {
      token: `Bearer ${token}`,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  socket.on('connect', () => {
    console.log('Socket.IO connected:', socket.id)
  })

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO disconnected:', reason)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
