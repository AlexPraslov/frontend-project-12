import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { initSocket, disconnectSocket } from '../socket'
import { notifyAuthError } from '../utils/notifications'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      // Инициализируем WebSocket после установки токена
      initSocket(token)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      disconnectSocket()
    }
    setLoading(false)
  }, [token])

  const login = async (usernameInput, password) => {
    try {
      const response = await axios.post('/api/v1/login', {
        username: usernameInput,
        password,
      })

      const { token: newToken } = response.data
      setToken(newToken)
      setUsername(usernameInput)
      localStorage.setItem('username', usernameInput)
      return { success: true }
    } catch (error) {
      notifyAuthError()
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка авторизации',
      }
    }
  }

  const signup = async (usernameInput, password) => {
    try {
      const response = await axios.post('/api/v1/signup', {
        username: usernameInput,
        password,
      })

      const { token: newToken } = response.data
      setToken(newToken)
      setUsername(usernameInput)
      localStorage.setItem('username', usernameInput)
      return { success: true }
    } catch (error) {
      if (error.response?.status === 409) {
        return {
          success: false,
          message: 'Такой пользователь уже существует',
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Ошибка регистрации',
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUsername('')
  }

  const value = {
    token,
    username,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
