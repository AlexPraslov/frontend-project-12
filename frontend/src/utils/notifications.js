import { toast } from 'react-toastify';
import i18n from '../i18n/i18n';

// Получаем функцию перевода напрямую из i18n
const getTranslation = (key, options = {}) => {
  return i18n.t(key, options);
};

export const showSuccess = (messageKey, options = {}) => {
  const message = getTranslation(messageKey, options);
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    ...options,
  });
};

export const showError = (messageKey, options = {}) => {
  const message = getTranslation(messageKey, options);
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    ...options,
  });
};

export const showWarning = (messageKey, options = {}) => {
  const message = getTranslation(messageKey, options);
  toast.warning(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    ...options,
  });
};

export const showInfo = (messageKey, options = {}) => {
  const message = getTranslation(messageKey, options);
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    ...options,
  });
};

// Специфичные уведомления для операций с каналами
export const notifyChannelCreated = () => {
  showSuccess('notifications.success.channelCreated');
};

export const notifyChannelRenamed = () => {
  showSuccess('notifications.success.channelRenamed');
};

export const notifyChannelRemoved = () => {
  showSuccess('notifications.success.channelRemoved');
};

export const notifyMessageSent = () => {
  showSuccess('notifications.success.messageSent');
};

// Специфичные уведомления для ошибок
export const notifyNetworkError = () => {
  showError('errors.network');
};

export const notifyServerError = () => {
  showError('notifications.error.server');
};

export const notifyLoadChannelsError = () => {
  showError('notifications.error.loadChannels');
};

export const notifyLoadMessagesError = () => {
  showError('notifications.error.loadMessages');
};

export const notifyCreateChannelError = () => {
  showError('notifications.error.createChannel');
};

export const notifyRenameChannelError = () => {
  showError('notifications.error.renameChannel');
};

export const notifyRemoveChannelError = () => {
  showError('notifications.error.removeChannel');
};

export const notifySendMessageError = () => {
  showError('notifications.error.sendMessage');
};

export const notifyAuthError = () => {
  // Убрал вызов showError, чтобы не показывать тост при ошибке авторизации
  // showError('notifications.error.auth');
};

// Уведомления о состоянии сети
export const notifyOffline = () => {
  showError('errors.network');
};

export const notifyReconnecting = () => {
  showWarning('notifications.warning.reconnecting');
};

export const notifyConnectionRestored = () => {
  showInfo('notifications.info.connectionRestored');
};
