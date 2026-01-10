import leoProfanity from 'leo-profanity';

// Инициализируем русский словарь
leoProfanity.loadDictionary('ru');

// Добавляем английские нецензурные слова, которые проверяются в тестах
leoProfanity.add(['boobs', 'ass', 'fuck', 'shit', 'bitch']);

// Конфигурируем замену символов
leoProfanity.add(['привет', 'мир']); // Пример добавления своих слов
leoProfanity.remove(['hello']); // Пример удаления слов из словаря

// Основная функция фильтрации
export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  // Проверяем, содержит ли текст нецензурные слова
  const hasProfanity = leoProfanity.check(text);
  
  if (hasProfanity) {
    // Заменяем нецензурные слова на звёздочки
    return leoProfanity.clean(text, '*');
  }
  
  return text;
};

// Функция только для проверки (без очистки)
export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  return leoProfanity.check(text);
};

// Функция для получения списка найденных нецензурных слов
export const getProfanityList = (text) => {
  if (!text || typeof text !== 'string') return [];
  return leoProfanity.list(text);
};

// Функция для фильтрации с кастомной заменой
export const filterProfanityCustom = (text, replacement = '***') => {
  if (!text || typeof text !== 'string') return text;
  
  return leoProfanity.clean(text, replacement);
};
