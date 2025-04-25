import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import promisePlugin from 'eslint-plugin-promise';

export default [
  {
    ignores: [
      'dist/**', // Build output
      'build/**', // Alternative build output
      'node_modules/**', // Third-party libraries
      'coverage/**', // Test coverage reports
      '.git/**', // Git metadata
      'cypress/**', // Cypress tests
      'public/**', // Static assets
      'static/**', // Additional static files
      'reports/**', // Test reports
      'logs/**', // Logs
      'tmp/**', // Temporary files
      '.cache/**', // Cache files
    ],
  },

  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  },

  { languageOptions: { globals: globals.browser } }, // Flat configuration for JS plugin
  pluginReact.configs.flat.recommended, // Flat configuration for React plugin
  prettierConfig, // Add Prettier configuration

  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json'],

          moduleDirectory: ['node_modules', './'],
        },
      },

      react: {
        version: 'detect',
      },
    },

    plugins: {
      import: importPlugin,
      'react-hooks': pluginReactHooks,
      prettier: prettierPlugin,
      promise: promisePlugin,
    },

    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      strict: ['error', 'global'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'import/no-duplicates': 'warn',
      'no-implicit-globals': 'error',
      'react/jsx-no-undef': ['error', { allowGlobals: true }],
      'prettier/prettier': 'error',
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',
    },
  },
];
