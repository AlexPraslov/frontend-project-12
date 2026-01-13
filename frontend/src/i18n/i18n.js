import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Импортируем переводы
import translationRu from './locales/ru/translation.json'

// Ресурсы переводов
const resources = {
  ru: {
    translation: translationRu,
  },
}

// Инициализация i18next
i18n
  .use(initReactI18next) // передает i18n в react-i18next
  .init({
    resources,
    lng: 'ru', // язык по умолчанию
    fallbackLng: 'ru', // язык по умолчанию, если перевод не найден

    interpolation: {
      escapeValue: false, // React уже защищает от XSS
    },

    // Опции для отладки (можно отключить в production)
    debug: process.env.NODE_ENV === 'development',

    // Реакция на изменение языка
    react: {
      useSuspense: false, // не использовать Suspense для i18next
    },
  })

export default i18n
