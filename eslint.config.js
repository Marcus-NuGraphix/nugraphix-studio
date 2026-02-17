// @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  // Ignore generated / tooling folders and config files
  {
    ignores: [
      '**/node_modules/**',
      '**/.output/**',
      '**/.vinxi/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.agents/**',

      // Tooling configs (do not lint with TS project rules)
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.ts',
    ],
  },

  ...tanstackConfig,
]
