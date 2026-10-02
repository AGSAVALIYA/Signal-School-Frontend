import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import i18next from 'eslint-plugin-i18next';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/', 'dev-dist/', 'node_modules/', 'coverage/', 'e2e-results/'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  prettier,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser }, parserOptions: { ecmaFeatures: { jsx: true } } },
    settings: { react: { version: '19' } },
    plugins: { i18next },
    rules: {
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'i18next/no-literal-string': [
        'error',
        { mode: 'jsx-text-only', 'jsx-attributes': { include: ['label', 'placeholder', 'title', 'aria-label', 'helperText'] } },
      ],
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/test/**', 'e2e/**', '*.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
    rules: { 'i18next/no-literal-string': 'off' },
  },
];
