import { describe, expect, it } from 'vitest'
import {
  AUTH_COOKIE_PREFIX,
  AUTH_IP_ADDRESS_HEADERS,
  AUTH_RATE_LIMIT_OPTIONS,
  MINIMUM_BETTER_AUTH_SECRET_LENGTH,
  assertAuthSecretStrength,
  assertTrustedOriginsSecurity,
  buildTrustedOrigins,
  deriveSecureCookieFlag,
  resolveSecureCookieFlag,
  toPublicResetUrl,
} from '@/features/auth/server/auth-config'

describe('auth config contracts', () => {
  describe('rate limiting options', () => {
    it('keeps auth rate limiting enabled with database storage', () => {
      expect(AUTH_RATE_LIMIT_OPTIONS).toEqual({
        enabled: true,
        storage: 'database',
        window: 60,
        max: 100,
      })
    })
  })

  describe('cookie and proxy headers', () => {
    it('uses a stable cookie prefix', () => {
      expect(AUTH_COOKIE_PREFIX).toBe('app')
    })

    it('includes hardened ip header precedence', () => {
      expect(AUTH_IP_ADDRESS_HEADERS).toEqual([
        'cf-connecting-ip',
        'x-forwarded-for',
        'x-real-ip',
      ])
    })

    it('derives secure-cookie mode from base URL protocol', () => {
      expect(deriveSecureCookieFlag('https://studio.nugraphix.co.za')).toBe(
        true,
      )
      expect(deriveSecureCookieFlag('http://localhost:3000')).toBe(false)
    })

    it('rejects insecure BETTER_AUTH_BASE_URL in production', () => {
      expect(() =>
        resolveSecureCookieFlag({
          NODE_ENV: 'production',
          BETTER_AUTH_BASE_URL: 'http://studio.nugraphix.co.za',
        }),
      ).toThrow('BETTER_AUTH_BASE_URL must use HTTPS in production.')
    })
  })

  describe('trusted origins', () => {
    it('deduplicates configured origin values', () => {
      expect(
        buildTrustedOrigins({
          BETTER_AUTH_URL: 'https://studio.nugraphix.co.za',
          BETTER_AUTH_BASE_URL: 'https://studio.nugraphix.co.za',
          BETTER_AUTH_TRUSTED_ORIGINS: [
            'https://admin.nugraphix.co.za',
            'https://studio.nugraphix.co.za',
          ],
        }),
      ).toEqual([
        'https://studio.nugraphix.co.za',
        'https://admin.nugraphix.co.za',
      ])
    })

    it('normalizes trusted origins to origin values', () => {
      expect(
        buildTrustedOrigins({
          BETTER_AUTH_URL: 'https://studio.nugraphix.co.za/api/auth',
          BETTER_AUTH_BASE_URL: 'https://studio.nugraphix.co.za/auth',
          BETTER_AUTH_TRUSTED_ORIGINS: ['https://admin.nugraphix.co.za/path'],
        }),
      ).toEqual([
        'https://studio.nugraphix.co.za',
        'https://admin.nugraphix.co.za',
      ])
    })

    it('rejects insecure trusted origins in production', () => {
      expect(() =>
        assertTrustedOriginsSecurity({
          runtimeEnv: { NODE_ENV: 'production' },
          origins: ['https://studio.nugraphix.co.za', 'http://localhost:3000'],
        }),
      ).toThrow('must use HTTPS in production')
    })
  })

  describe('auth secret policy', () => {
    it('accepts secret values at minimum length', () => {
      const result = assertAuthSecretStrength({
        NODE_ENV: 'production',
        BETTER_AUTH_SECRET: 'x'.repeat(MINIMUM_BETTER_AUTH_SECRET_LENGTH),
      })

      expect(result).toEqual({
        valid: true,
        secretLength: MINIMUM_BETTER_AUTH_SECRET_LENGTH,
      })
    })

    it('reports weak secrets in non-production', () => {
      const result = assertAuthSecretStrength({
        NODE_ENV: 'development',
        BETTER_AUTH_SECRET: 'short-secret',
      })

      expect(result.valid).toBe(false)
      expect(result.secretLength).toBe('short-secret'.length)
    })

    it('throws for weak secrets in production', () => {
      expect(() =>
        assertAuthSecretStrength({
          NODE_ENV: 'production',
          BETTER_AUTH_SECRET: 'weak-secret',
        }),
      ).toThrow('BETTER_AUTH_SECRET must be at least')
    })
  })

  describe('reset URL shaping', () => {
    it('emits query-token reset URLs for public route contract', () => {
      const url = toPublicResetUrl({
        token: 'token_123',
        generatedUrl:
          'https://auth.nugraphix.co.za/reset-password?token=token_123&callbackURL=%2Fadmin%2Fusers',
        runtimeEnv: {
          BETTER_AUTH_BASE_URL: 'https://auth.nugraphix.co.za',
          PUBLIC_APP_URL: 'https://studio.nugraphix.co.za',
        },
      })

      const parsed = new URL(url)
      expect(parsed.pathname).toBe('/reset-password/')
      expect(parsed.searchParams.get('token')).toBe('token_123')
      expect(parsed.searchParams.get('callbackURL')).toBe('/admin/users')
    })

    it('drops unsafe callbackURL values from reset links', () => {
      const url = toPublicResetUrl({
        token: 'token_abc',
        generatedUrl:
          'https://auth.nugraphix.co.za/reset-password?callbackURL=https%3A%2F%2Fevil.example',
        runtimeEnv: {
          BETTER_AUTH_BASE_URL: 'https://auth.nugraphix.co.za',
          PUBLIC_APP_URL: 'https://studio.nugraphix.co.za',
        },
      })

      const parsed = new URL(url)
      expect(parsed.searchParams.get('token')).toBe('token_abc')
      expect(parsed.searchParams.has('callbackURL')).toBe(false)
    })
  })
})
