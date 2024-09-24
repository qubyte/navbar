import globals from 'globals';
import config from 'eslint-config-qubyte';

export default [
  config,
  {
    files: ['**/*.js'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['test/test.js'],
    languageOptions: { globals: { ...globals.mocha, chai: true, sinon: true } }
  }
];
