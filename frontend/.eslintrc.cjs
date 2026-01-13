module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@stylistic/recommended-extends',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'react/prop-types': 'off',
  },
}
