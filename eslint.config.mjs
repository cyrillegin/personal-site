import globals from 'globals';
import js from '@eslint/js';

const GLOBALS_BROWSER_FIX = Object.assign({}, globals.browser, {
  AudioWorkletGlobalScope: globals.browser['AudioWorkletGlobalScope ']
});

delete GLOBALS_BROWSER_FIX['AudioWorkletGlobalScope '];

export default [
  js.configs.recommended, 
  {
    
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...GLOBALS_BROWSER_FIX,
        ...globals.node,
      },
    },

    rules: {
      indent: ['error', 2, {
        SwitchCase: 1,
      }],

      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      'no-console': ['error', {
        allow: ['error', 'info'],
      }],
    },
  }, {
    files: ['**/.eslintrc.{js,cjs}'],
  }];