// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

const clientOnlyFiles = [
  'src/components/**/*.{ts,tsx}',
  'src/hooks/**/*.{ts,tsx}',
  'src/features/**/ui/**/*.{ts,tsx}',
]

export default [
  {
    ignores: [
      '.agents/**',
      '.claude/**',
      '.codex/**',
      '.output/**',
      '**/dist/**',
      '**/.tanstack/**',
      '**/.output/**',
      '**/.agents/**',
      '**/.claude/**',
      '**/.codex/**',
      '**/nextjs-migrate/**',
      '**/coverage/**',
      '**/node_modules/**',
      'src/routeTree.gen.ts',
      'src/components/_examples/**',
      '**/eslint.config.js',
      '**/prettier.config.js',
      'tools/**',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  ...tanstackConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/data/*', '@/schemas/*'],
              message:
                'Legacy adapter imports are removed. Import from @/features/* or @/shared/*.',
            },
          ],
        },
      ],
    },
  },
  {
    files: clientOnlyFiles,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/features/*/server',
                '@/features/*/server/*',
                '**/*.server',
                '@/**/*.server',
              ],
              message: 'Client-only modules must not import server-only code.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/db', '@/db/*'],
              message:
                'Route files should access data via feature server modules/server functions.',
            },
          ],
        },
      ],
    },
  },
]
