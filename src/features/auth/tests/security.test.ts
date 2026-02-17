import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRequestHeaders } from '@tanstack/react-start/server'
import {
  changePasswordForCurrentUser,
  listCurrentUserSessions,
  revokeAllCurrentUserSessions,
  revokeCurrentUserSession,
} from '../server/security'
import { checkRateLimit } from '@/features/auth/server/rate-limit'
import { auth } from '@/features/auth/server/auth'

vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: vi.fn(),
}))

vi.mock('@/features/auth/server/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}))

vi.mock('@/features/auth/server/auth', () => ({
  auth: {
    api: {
      changePassword: vi.fn(),
      listSessions: vi.fn(),
      revokeSession: vi.fn(),
      revokeSessions: vi.fn(),
    },
  },
}))

describe('security helpers', () => {
  const getRequestHeadersMock = vi.mocked(getRequestHeaders)
  const checkRateLimitMock = vi.mocked(checkRateLimit)
  const changePasswordMock = vi.mocked(auth.api.changePassword)
  const listSessionsMock = vi.mocked(auth.api.listSessions)
  const revokeSessionMock = vi.mocked(auth.api.revokeSession)
  const revokeSessionsMock = vi.mocked(auth.api.revokeSessions)

  beforeEach(() => {
    vi.clearAllMocks()
    getRequestHeadersMock.mockReturnValue(new Headers())
  })

  describe('changePasswordForCurrentUser', () => {
    it('checks rate limit before changing password', async () => {
      checkRateLimitMock.mockResolvedValueOnce({
        allowed: true,
        remaining: 9,
        resetAt: Date.now() + 60_000,
      })
      changePasswordMock.mockResolvedValueOnce({} as never)

      await changePasswordForCurrentUser({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      })

      expect(checkRateLimitMock).toHaveBeenCalledWith({
        key: expect.stringContaining('password-change:'),
        limit: 10,
        windowMs: 60_000,
      })
    })

    it('throws when rate limited', async () => {
      checkRateLimitMock.mockResolvedValueOnce({
        allowed: false,
        remaining: 0,
        resetAt: Date.now() + 60_000,
      })

      await expect(
        changePasswordForCurrentUser({
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass456!',
        }),
      ).rejects.toThrow(
        'Too many password change attempts. Please wait a minute.',
      )

      expect(changePasswordMock).not.toHaveBeenCalled()
    })

    it('passes credentials and headers to auth API', async () => {
      const headers = new Headers({ cookie: 'session=abc' })
      getRequestHeadersMock.mockReturnValue(headers)
      checkRateLimitMock.mockResolvedValueOnce({
        allowed: true,
        remaining: 9,
        resetAt: Date.now() + 60_000,
      })
      changePasswordMock.mockResolvedValueOnce({} as never)

      await changePasswordForCurrentUser({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
        revokeOtherSessions: true,
      })

      expect(changePasswordMock).toHaveBeenCalledWith({
        body: {
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass456!',
          revokeOtherSessions: true,
        },
        headers,
      })
    })

    it('uses x-forwarded-for header for rate limit key', async () => {
      const headers = new Headers({ 'x-forwarded-for': '203.0.113.50' })
      getRequestHeadersMock.mockReturnValue(headers)
      checkRateLimitMock.mockResolvedValueOnce({
        allowed: true,
        remaining: 9,
        resetAt: Date.now() + 60_000,
      })
      changePasswordMock.mockResolvedValueOnce({} as never)

      await changePasswordForCurrentUser({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      })

      expect(checkRateLimitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'password-change:203.0.113.50',
        }),
      )
    })

    it('falls back to local key when no forwarded header present', async () => {
      getRequestHeadersMock.mockReturnValue(new Headers())
      checkRateLimitMock.mockResolvedValueOnce({
        allowed: true,
        remaining: 9,
        resetAt: Date.now() + 60_000,
      })
      changePasswordMock.mockResolvedValueOnce({} as never)

      await changePasswordForCurrentUser({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      })

      expect(checkRateLimitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'password-change:local',
        }),
      )
    })
  })

  describe('listCurrentUserSessions', () => {
    it('forwards request headers', async () => {
      const headers = new Headers({ cookie: 'session=abc' })
      getRequestHeadersMock.mockReturnValue(headers)
      listSessionsMock.mockResolvedValueOnce([] as never)

      await listCurrentUserSessions()

      expect(listSessionsMock).toHaveBeenCalledWith({ headers })
    })
  })

  describe('revokeCurrentUserSession', () => {
    it('passes token and headers to auth API', async () => {
      const headers = new Headers({ cookie: 'session=abc' })
      getRequestHeadersMock.mockReturnValue(headers)
      revokeSessionMock.mockResolvedValueOnce({} as never)

      await revokeCurrentUserSession('session_token_123')

      expect(revokeSessionMock).toHaveBeenCalledWith({
        body: { token: 'session_token_123' },
        headers,
      })
    })
  })

  describe('revokeAllCurrentUserSessions', () => {
    it('forwards request headers', async () => {
      const headers = new Headers({ cookie: 'session=abc' })
      getRequestHeadersMock.mockReturnValue(headers)
      revokeSessionsMock.mockResolvedValueOnce({} as never)

      await revokeAllCurrentUserSessions()

      expect(revokeSessionsMock).toHaveBeenCalledWith({ headers })
    })
  })
})
