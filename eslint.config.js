import esLint from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tsESLint from 'typescript-eslint';
import prettierConfig from './.prettier.config.js';

const config = tsESLint.config(
  {
    ignores: [
      // Backup files
      '.composer.bak/',
      // Build output directory
      'dist/',
      // Cache files
      '.eslintcache',
      // Config files
      '.prettier.config.js',
      'commitlint.config.js',
      'eslint.config.js',
      'lint-staged.config.js'
    ]
  },
  esLint.configs.recommended,
  ...tsESLint.configs.recommended,
  prettierRecommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
        ...globals.serviceworker,
        ...globals.worker
      }
    },
    rules: {
      'import/no-duplicates': 'off',
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'prettier/prettier': ['error', prettierConfig],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description'
        }
      ],
      '@typescript-eslint/ban-types': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
);

export default config;
