module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  // extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['babel', 'import', 'react'],
  rules: {
    'no-multiple-empty-lines': 'error'
    // 'linebreak-style': 'off', // Неправильно работает в Windows.
    // 'arrow-parens': 'off', // Несовместимо с prettier
    // 'object-curly-newline': 'off', // Несовместимо с prettier
    // 'no-mixed-operators': 'off', // Несовместимо с prettier
    // 'arrow-body-style': 'off', // Это - не наш стиль?
    // 'function-paren-newline': 'off', // Несовместимо с prettier
    // 'no-plusplus': 'off',
    // 'space-before-function-paren': 0, // Несовместимо с prettier

    
    // 'no-console': 'error', // airbnb использует предупреждение
    // 'no-alert': 'error', // airbnb использует предупреждение

    // 'no-param-reassign': 'off', // Это - не наш стиль?
    // radix: 'off', // parseInt, parseFloat и radix выключены. Мне это не нравится.

    // 'react/require-default-props': 'off', // airbnb использует уведомление об ошибке
    // 'react/forbid-prop-types': 'off', // airbnb использует уведомление об ошибке
    // 'react/jsx-filename-extension': ['error', { extensions: ['.js'] }], // airbnb использует .jsx

    // 'prefer-destructuring': 'off',

    // 'react/no-find-dom-node': 'off', // Я этого не знаю
    // 'react/no-did-mount-set-state': 'off',
    // 'react/no-unused-prop-types': 'off', // Это всё ещё работает нестабильно
    // 'react/jsx-one-expression-per-line': 'off',

    // // свои исправления:
    // 'import/no-unresolved': 'off',
    // 'object-shorthand': [0, 'never'],
    // 'react/prop-types': 'off',
    // 'react/jsx-filename-extension': [0, { extensions: ['.jsx'] }],
    // 'no-bitwise': 'off',
    // 'max-len': ['error', {code: 100, tabWidth: 2, ignoreUrls: true, ignoreStrings: true }], // airbnb позволяет некоторые пограничные случаи

  },
};
