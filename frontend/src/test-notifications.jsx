// Временный компонент для теста уведомлений
import { useEffect } from 'react'
import {
  notifyChannelCreated,
  notifyChannelRenamed,
  notifyChannelRemoved,
  notifyNetworkError,
  notifyOffline,
  notifyConnectionRestored,
} from './utils/notifications'

export const TestNotifications = () => {
  useEffect(() => {
    // Показываем тестовые уведомления через 1 секунду
    const timer = setTimeout(() => {
      console.log('Показываем тестовые уведомления...')
      notifyChannelCreated()
      notifyChannelRenamed()
      notifyChannelRemoved()
      notifyNetworkError()
      notifyOffline()
      notifyConnectionRestored()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null
}
