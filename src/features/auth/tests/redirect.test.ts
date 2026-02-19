import { describe, expect, it } from 'vitest'
import { toSafeRedirectPath } from '@/features/auth/model/redirect'

describe('toSafeRedirectPath', () => {
  describe('allows safe local paths', () => {
    it('passes through simple paths', () => {
      expect(toSafeRedirectPath('/dashboard')).toBe('/dashboard')
    })

    it('passes through nested paths', () => {
      expect(toSafeRedirectPath('/dashboard/users/123')).toBe(
        '/dashboard/users/123',
      )
    })

    it('passes through paths with query strings', () => {
      expect(toSafeRedirectPath('/account/security?tab=sessions')).toBe(
        '/account/security?tab=sessions',
      )
    })

    it('passes through paths with hash fragments', () => {
      expect(toSafeRedirectPath('/docs#section-1')).toBe('/docs#section-1')
    })

    it('passes through root path', () => {
      expect(toSafeRedirectPath('/')).toBe('/')
    })
  })

  describe('blocks unsafe values', () => {
    it('blocks absolute HTTP URLs', () => {
      expect(toSafeRedirectPath('https://evil.com')).toBe('/')
    })

    it('blocks protocol-relative URLs', () => {
      expect(toSafeRedirectPath('//evil.com/phish')).toBe('/')
    })

    it('blocks javascript: protocol', () => {
      expect(toSafeRedirectPath('javascript:alert(1)')).toBe('/')
    })

    it('blocks data: protocol', () => {
      expect(toSafeRedirectPath('data:text/html,<script>')).toBe('/')
    })

    it('blocks empty strings', () => {
      expect(toSafeRedirectPath('')).toBe('/')
    })

    it('blocks whitespace-only strings', () => {
      expect(toSafeRedirectPath('   ')).toBe('/')
    })

    it('blocks relative paths without leading slash', () => {
      expect(toSafeRedirectPath('dashboard')).toBe('/')
    })

    it('blocks very long redirect paths', () => {
      const longPath = '/' + 'a'.repeat(2100)
      expect(toSafeRedirectPath(longPath)).toBe('/')
    })
  })

  describe('handles non-string values', () => {
    it('returns fallback for undefined', () => {
      expect(toSafeRedirectPath(undefined)).toBe('/')
    })

    it('returns fallback for null', () => {
      expect(toSafeRedirectPath(null)).toBe('/')
    })

    it('returns fallback for numbers', () => {
      expect(toSafeRedirectPath(42)).toBe('/')
    })

    it('returns fallback for objects', () => {
      expect(toSafeRedirectPath({ to: '/admin' })).toBe('/')
    })

    it('returns fallback for arrays', () => {
      expect(toSafeRedirectPath(['/admin'])).toBe('/')
    })
  })

  describe('custom fallback', () => {
    it('uses provided fallback instead of default', () => {
      expect(toSafeRedirectPath('', '/home')).toBe('/home')
    })

    it('uses provided fallback for unsafe values', () => {
      expect(toSafeRedirectPath('https://evil.com', '/home')).toBe('/home')
    })
  })

  describe('edge cases', () => {
    it('trims whitespace before validation', () => {
      expect(toSafeRedirectPath('  /dashboard  ')).toBe('/dashboard')
    })

    it('blocks ftp: protocol', () => {
      expect(toSafeRedirectPath('ftp://files.example.com')).toBe('/')
    })

    it('blocks mailto: protocol', () => {
      expect(toSafeRedirectPath('mailto:admin@example.com')).toBe('/')
    })
  })
})
