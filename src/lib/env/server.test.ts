import { describe, expect, it } from 'vitest'
import { parseServerEnv } from '@/lib/env/server'

const baseEnv = {
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://local:test@localhost:5432/nugraphix',
  BETTER_AUTH_SECRET: 'test-secret',
  BETTER_AUTH_URL: 'http://localhost:3000',
  BETTER_AUTH_BASE_URL: 'http://localhost:3000',
  S3_REGION: 'us-east-1',
  S3_BUCKET: 'assets',
  S3_ACCESS_KEY_ID: 'local',
  S3_SECRET_ACCESS_KEY: 'local-secret',
} as const

describe('parseServerEnv', () => {
  it('parses defaults for optional values', () => {
    const result = parseServerEnv({ ...baseEnv })

    expect(result.EMAIL_PROVIDER).toBe('noop')
    expect(result.S3_FORCE_PATH_STYLE).toBe(false)
    expect(result.RECAPTCHA_MIN_SCORE).toBe(0.5)
  })

  it('requires RESEND_API_KEY when resend provider is enabled', () => {
    expect(() =>
      parseServerEnv({
        ...baseEnv,
        EMAIL_PROVIDER: 'resend',
      }),
    ).toThrow(/RESEND_API_KEY/)
  })

  it('requires both recaptcha keys when one is set', () => {
    expect(() =>
      parseServerEnv({
        ...baseEnv,
        VITE_RECAPTCHA_SITE_KEY: 'site-key',
      }),
    ).toThrow(/RECAPTCHA_SECRET_KEY/)
  })

  it('requires task drain authorization secret in production', () => {
    expect(() =>
      parseServerEnv({
        ...baseEnv,
        NODE_ENV: 'production',
      }),
    ).toThrow(/BACKGROUND_TASKS_DRAIN_SECRET|CRON_SECRET/)
  })
})
