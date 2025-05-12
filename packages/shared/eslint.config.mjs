// @ts-check

import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      '.eslintrc.js',
      'eslint.config.mjs'
    ]
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  {
    rules: {
    },
  },
);