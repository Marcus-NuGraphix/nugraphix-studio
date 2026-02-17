import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRequestHeaders } from '@tanstack/react-start/server'
import {
  getOptionalSession,
  requireAdmin,
  requireSession,
} from '../server/session.server'
import { auth } from '@/features/auth/server/auth'

vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: vi.fn(),
}))

vi.mock('@/features/auth/server/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

const mockSession = (overrides: Record<string, unknown> = {}) =>
  ({
    user: {
      id: 'user_1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      ...overrides,
    },
  }) as Awaited<ReturnType<typeof auth.api.getSession>>

describe('session.server auth boundaries', () => {
  const getRequestHeadersMock = vi.mocked(getRequestHeaders)
  const getSessionMock = vi.mocked(auth.api.getSession)

  beforeEach(() => {
    vi.clearAllMocks()
    getRequestHeadersMock.mockReturnValue(new Headers())
  })

  describe('getOptionalSession', () => {
    it('returns null when no session exists', async () => {
      getSessionMock.mockResolvedValueOnce(null)

      const session = await getOptionalSession()

      expect(session).toBeNull()
    })

    it('returns session with normalized role for valid session', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: 'admin' }))

      const session = await getOptionalSession()

      expect(session).not.toBeNull()
      expect(session?.user.role).toBe('admin')
    })

    it('normalizes unknown roles to user', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: 'manager' }))

      const session = await getOptionalSession()

      expect(session?.user.role).toBe('user')
    })

    it('normalizes empty string role to user', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: '' }))

      const session = await getOptionalSession()

      expect(session?.user.role).toBe('user')
    })

    it('normalizes undefined role to user', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: undefined }))

      const session = await getOptionalSession()

      expect(session?.user.role).toBe('user')
    })

    it('normalizes null role to user', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: null }))

      const session = await getOptionalSession()

      expect(session?.user.role).toBe('user')
    })

    it('preserves admin role without normalization', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: 'admin' }))

      const session = await getOptionalSession()

      expect(session?.user.role).toBe('admin')
    })

    it('passes request headers to auth.api.getSession', async () => {
      const headers = new Headers({ cookie: 'app.session_token=abc' })
      getRequestHeadersMock.mockReturnValue(headers)
      getSessionMock.mockResolvedValueOnce(null)

      await getOptionalSession()

      expect(getSessionMock).toHaveBeenCalledWith({ headers })
    })
  })

  describe('requireSession', () => {
    it('redirects to login when session is missing', async () => {
      getSessionMock.mockResolvedValueOnce(null)

      await expect(requireSession()).rejects.toMatchObject({
        options: {
          to: '/login',
          search: { redirect: undefined },
        },
      })
    })

    it('returns session when authenticated', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession())

      const session = await requireSession()

      expect(session.user.id).toBe('user_1')
    })
  })

  describe('requireAdmin', () => {
    it('redirects non-admin users to home', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: 'user' }))

      await expect(requireAdmin()).rejects.toMatchObject({
        options: { to: '/' },
      })
    })

    it('redirects unauthenticated users to login', async () => {
      getSessionMock.mockResolvedValueOnce(null)

      await expect(requireAdmin()).rejects.toMatchObject({
        options: { to: '/login' },
      })
    })

    it('returns session for admin users', async () => {
      getSessionMock.mockResolvedValueOnce(mockSession({ role: 'admin' }))

      const session = await requireAdmin()

      expect(session.user.id).toBe('user_1')
      expect(session.user.role).toBe('admin')
    })
  })
})
