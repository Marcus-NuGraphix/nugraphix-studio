import { describe, expect, it } from 'vitest'
import {
  buildAuthRateLimitKey,
  getClientIpFromHeaders,
  getUserAgentFromHeaders,
} from '@/features/auth/server/request-context'

describe('auth request context helpers', () => {
  describe('getClientIpFromHeaders', () => {
    it('prefers cf-connecting-ip when present', () => {
      const headers = new Headers({
        'cf-connecting-ip': '198.51.100.7',
        'x-forwarded-for': '203.0.113.5',
      })

      expect(getClientIpFromHeaders(headers)).toBe('198.51.100.7')
    })

    it('uses first x-forwarded-for address when cf header is absent', () => {
      const headers = new Headers({
        'x-forwarded-for': '203.0.113.5, 203.0.113.6',
      })

      expect(getClientIpFromHeaders(headers)).toBe('203.0.113.5')
    })

    it('falls back to local when no ip headers exist', () => {
      expect(getClientIpFromHeaders(new Headers())).toBe('local')
    })
  })

  describe('buildAuthRateLimitKey', () => {
    it('builds stable auth-namespaced rate limit keys', () => {
      const headers = new Headers({ 'x-real-ip': '203.0.113.10' })
      expect(
        buildAuthRateLimitKey('password-change', headers, 'current-user'),
      ).toBe('auth:password-change:203.0.113.10:current-user')
    })
  })

  describe('getUserAgentFromHeaders', () => {
    it('returns null when user-agent is missing', () => {
      expect(getUserAgentFromHeaders(new Headers())).toBeNull()
    })

    it('returns a trimmed user-agent value', () => {
      const headers = new Headers({ 'user-agent': '  VitestBrowser/1.0  ' })
      expect(getUserAgentFromHeaders(headers)).toBe('VitestBrowser/1.0')
    })
  })
})
