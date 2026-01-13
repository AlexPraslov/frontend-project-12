module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // КРИТИЧЕСКИЕ ДЛЯ CI
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    
    // Для нашего кода
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    
    // Разрешаем inline стили
    'react/style-prop-object': 'off',
    'react/jsx-props-no-spreading': 'off',
    
    // Менее строгие
    'max-len': ['warn', { code: 120, ignoreUrls: true }],
    'comma-dangle': ['error', 'only-multiline'],
    'no-console': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    '*.config.js',
    '*.cjs'
  ],
};
