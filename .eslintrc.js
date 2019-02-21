module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb',
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
    'no-multiple-empty-lines': 'error',
    'linebreak-style': 'off', // Неправильно работает в Windows.
    'import/no-unresolved': 'off', // убирает проблему с imports
    'arrow-parens': 'off', // Несовместимо с prettier
    'object-curly-newline': 'off', // Несовместимо с prettier
    'no-mixed-operators': 'off', // Несовместимо с prettier
    'arrow-body-style': 'off', // Это - не наш стиль?
    'function-paren-newline': 'off', // Несовместимо с prettier
    'no-plusplus': 'off',
    'space-before-function-paren': 0, // Несовместимо с prettier

    'no-console': 'error', // airbnb использует предупреждение
    'no-alert': 'error', // airbnb использует предупреждение

    'no-param-reassign': 'off', // Это - не наш стиль?
    radix: 'off', // parseInt, parseFloat и radix выключены. Мне это не нравится.

    'react/require-default-props': 'off', // airbnb использует уведомление об ошибке
    'react/forbid-prop-types': 'off', // airbnb использует уведомление об ошибке
    'prefer-destructuring': 'off',

    'react/no-find-dom-node': 'off', // Я этого не знаю
    'react/no-did-mount-set-state': 'off',
    'react/no-unused-prop-types': 'off', // Это всё ещё работает нестабильно
    'react/jsx-one-expression-per-line': 'off',

    // свои исправления:
    'object-shorthand': [0, 'never'],
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [0, { extensions: ['.jsx'] }],
    'no-bitwise': 'off',
    'no-trailing-spaces': 'off',
    'jsx-a11y/click-events-have-key-events': 'off', // handler может передаваться напрямую, необязательно каждый раз для него прописывать обертку
    'jsx-a11y/no-static-element-interactions': 'off', // в случае с AdvancedSVG - данный элемент может использоваться в нескольких ролях
    'no-unused-vars': 'warn', // неиспользуемые переменные необязательно - ошибка, лучше выводить предупреждение
    'react/jsx-boolean-value': 'warn', // возможно, может потребоваться явное указание, поэтому предупреждние
    'react/no-array-index-key': 'warn', // это необязательно ошибка, оставим предупреждение
    'no-lonely-if': 'warn', // ?это необязательно ошибка, оставим предупреждение - что такого?
    'prefer-const': 'warn', // ?в цикле for (... of...) это сбивает с толку
    'no-alert': 'off', // пока что можно обойтись без модального окна
    'no-else-return': 'off',
    'react/sort-comp': 'off', // AdvancedBoard - очень сложный компонент, поэтому тут нельзя строго соблюдать порядок методов
    'class-methods-use-this': 'off', // не для react, а вообще под вопросом (AdvancedBoard!)
    'react/no-did-update-set-state': 'off', // ?в моем случае - это выход для обновления данных (либо это можно сделать по-другому)
    'no-restricted-syntax': 'off', // возможно конструкции let a of array - тяжелые, но зато удобно читаемые, поэтому отмена

  },

};
