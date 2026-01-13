module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    // Для arrow-parens
    'arrow-parens': ['error', 'as-needed'],
    // Для brace-style
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    // Для indent (включая indent-binary-ops)
    'indent': ['error', 2],
    // Для quote-props
    'quote-props': ['error', 'consistent-as-needed'],
    // Для multiline-ternary (НЕ исправится автоматически!)
    'multiline-ternary': ['error', 'always-multiline'],
    // Для JSX пропсов
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
};
