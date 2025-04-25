import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config} */
export default {
  ignores: [
    'dist/**',
    'build/**',
    'node_modules/**',
    'coverage/**',
    '.git/**',
    'cypress/**',
    'public/**',
    'static/**',
    'reports/**',
    'logs/**',
    'tmp/**',
    '.cache/**',
  ],
  languageOptions: {
    globals: {
      ...globals.node, // Include only Node.js globals
      ...globals.jest, // Include Jest globals
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs', '.cjs', '.json'], // Ensure supported file types are resolved
        moduleDirectory: ['node_modules', './'],
      },
    },
  },
  plugins: {
    import: importPlugin,
  },
  rules: {
    'no-console': 'off', // Disable no-console rule
    'import/no-unresolved': 'error', // Report unresolved imports
    'no-undef': 'error', // Report undefined variables
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn about unused vars except those starting with _
    strict: ['error', 'global'], // Enforce strict mode globally
    'semi': ['error', 'always'], // Enforce semicolons
    'quotes': ['error', 'single'], // Enforce single quotes
    'comma-dangle': ['error', 'always-multiline'], // Enforce trailing commas
  },
};
