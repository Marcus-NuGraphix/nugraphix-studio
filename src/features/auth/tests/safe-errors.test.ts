import { describe, expect, it } from 'vitest'
import { toSafeAuthErrorMessage } from '@/features/auth/model/safe-errors'

describe('toSafeAuthErrorMessage', () => {
  describe('login mode', () => {
    const mode = 'login' as const

    it('returns generic message for non-Error values', () => {
      expect(toSafeAuthErrorMessage({ error: 'string error', mode })).toBe(
        'Unable to sign in. Check your credentials and try again.',
      )
    })

    it('returns generic message for null error', () => {
      expect(toSafeAuthErrorMessage({ error: null, mode })).toBe(
        'Unable to sign in. Check your credentials and try again.',
      )
    })

    it('returns generic message for undefined error', () => {
      expect(toSafeAuthErrorMessage({ error: undefined, mode })).toBe(
        'Unable to sign in. Check your credentials and try again.',
      )
    })

    it('maps "invalid email" to safe credential message', () => {
      expect(
        toSafeAuthErrorMessage({ error: new Error('Invalid email'), mode }),
      ).toBe('Invalid email or password.')
    })

    it('maps "invalid password" to safe credential message', () => {
      expect(
        toSafeAuthErrorMessage({ error: new Error('Invalid password'), mode }),
      ).toBe('Invalid email or password.')
    })

    it('maps "invalid credentials" to safe credential message', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Invalid credentials provided'),
          mode,
        }),
      ).toBe('Invalid email or password.')
    })

    it('case-insensitive matching', () => {
      expect(
        toSafeAuthErrorMessage({ error: new Error('INVALID EMAIL'), mode }),
      ).toBe('Invalid email or password.')
    })

    it('returns generic message for unrecognized errors', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Database connection failed'),
          mode,
        }),
      ).toBe('Unable to sign in. Check your credentials and try again.')
    })

    it('returns generic message for Error with empty message', () => {
      expect(toSafeAuthErrorMessage({ error: new Error(''), mode })).toBe(
        'Unable to sign in. Check your credentials and try again.',
      )
    })
  })

  describe('signup mode', () => {
    const mode = 'signup' as const

    it('maps "already exists" to duplicate account message', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('User already exists'),
          mode,
        }),
      ).toBe('An account with this email already exists.')
    })

    it('maps "already registered" to duplicate account message', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Email already registered'),
          mode,
        }),
      ).toBe('An account with this email already exists.')
    })

    it('maps "already in use" to duplicate account message', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Email already in use'),
          mode,
        }),
      ).toBe('An account with this email already exists.')
    })

    it('returns generic signup message for unrecognized errors', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Internal server error'),
          mode,
        }),
      ).toBe('Unable to create your account right now. Please try again.')
    })
  })

  describe('forgot-password mode', () => {
    const mode = 'forgot-password' as const

    it('returns generic message for all errors', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('User not found'),
          mode,
        }),
      ).toBe(
        'Unable to send reset instructions right now. Please try again.',
      )
    })

    it('does not leak user existence information', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('No account with this email'),
          mode,
        }),
      ).toBe(
        'Unable to send reset instructions right now. Please try again.',
      )
    })
  })

  describe('reset-password mode', () => {
    const mode = 'reset-password' as const

    it('maps "invalid token" to expired link message', () => {
      expect(
        toSafeAuthErrorMessage({ error: new Error('Invalid token'), mode }),
      ).toBe('This reset link is invalid or expired. Request a new one.')
    })

    it('maps "token expired" to expired link message', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Token expired'),
          mode,
        }),
      ).toBe('This reset link is invalid or expired. Request a new one.')
    })

    it('maps "bad request" to expired link message', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Bad request: token missing'),
          mode,
        }),
      ).toBe('This reset link is invalid or expired. Request a new one.')
    })

    it('returns generic reset message for unrecognized errors', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Server timeout'),
          mode,
        }),
      ).toBe(
        'Unable to reset your password. Request a new reset link and try again.',
      )
    })
  })

  describe('cross-mode isolation', () => {
    it('does not match login patterns in signup mode', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Invalid credentials'),
          mode: 'signup',
        }),
      ).toBe('Unable to create your account right now. Please try again.')
    })

    it('does not match signup patterns in login mode', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('User already exists'),
          mode: 'login',
        }),
      ).toBe('Unable to sign in. Check your credentials and try again.')
    })

    it('does not match reset-password patterns in signup mode', () => {
      expect(
        toSafeAuthErrorMessage({
          error: new Error('Invalid token'),
          mode: 'signup',
        }),
      ).toBe('Unable to create your account right now. Please try again.')
    })
  })

  describe('structured error payloads', () => {
    it('maps structured rate-limit errors to safe retry copy', () => {
      expect(
        toSafeAuthErrorMessage({
          error: {
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests',
            },
          },
          mode: 'login',
        }),
      ).toBe('Too many attempts. Please wait before retrying.')
    })

    it('maps structured NOT_FOUND reset errors to invalid-link copy', () => {
      expect(
        toSafeAuthErrorMessage({
          error: {
            code: 'NOT_FOUND',
            message: 'Token not found',
          },
          mode: 'reset-password',
        }),
      ).toBe('This reset link is invalid or expired. Request a new one.')
    })
  })
})
