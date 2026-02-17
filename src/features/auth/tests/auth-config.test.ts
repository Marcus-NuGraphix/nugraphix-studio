import { describe, expect, it } from 'vitest'
import { auth } from '@/features/auth/server/auth'

describe('auth config invariants', () => {
  const options = auth.options

  describe('rate limiting', () => {
    it('has rate limiting enabled', () => {
      expect(options.rateLimit).toMatchObject({
        enabled: true,
        storage: 'database',
        window: 60,
        max: 100,
      })
    })
  })

  describe('email and password', () => {
    it('has email/password auth enabled', () => {
      expect(options.emailAndPassword).toMatchObject({ enabled: true })
    })
  })

  describe('email verification', () => {
    it('sends verification email on signup', () => {
      expect(options.emailVerification).toMatchObject({ sendOnSignUp: true })
    })
  })

  describe('cookie security', () => {
    it('uses a branded cookie prefix', () => {
      expect(options.advanced).toMatchObject({ cookiePrefix: 'app' })
    })

    it('derives secure cookie flag from base URL protocol', () => {
      const expectedSecure = options.baseURL.startsWith('https://')
      expect(options.advanced).toMatchObject({
        useSecureCookies: expectedSecure,
      })
    })
  })

  describe('ip address headers', () => {
    it('reads forwarded IP from standard proxy headers', () => {
      const headers = (
        options.advanced as { ipAddress: { ipAddressHeaders: Array<string> } }
      ).ipAddress.ipAddressHeaders
      expect(headers).toContain('x-forwarded-for')
      expect(headers).toContain('x-real-ip')
    })
  })

  describe('trusted origins', () => {
    it('includes the configured base URL as a trusted origin', () => {
      const origins = options.trustedOrigins
      expect(origins).toContain(options.baseURL)
    })
  })

  describe('plugins', () => {
    it('has plugins configured', () => {
      expect(options.plugins).toBeDefined()
      expect(options.plugins.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('database hooks', () => {
    it('has a post-create user hook for welcome email', () => {
      const hooks = options.databaseHooks as {
        user: { create: { after: unknown } }
      }
      expect(typeof hooks.user.create.after).toBe('function')
    })
  })
})
