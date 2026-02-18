import { beforeEach, describe, expect, it, vi } from 'vitest'
import { redirectAuthenticatedAuthEntry } from '@/features/auth/server/entry-redirect'
import { getOptionalSessionFn } from '@/features/auth/server/session'

vi.mock('@/features/auth/server/session', () => ({
  getOptionalSessionFn: vi.fn(),
}))

const getOptionalSessionFnMock = vi.mocked(getOptionalSessionFn)

describe('redirectAuthenticatedAuthEntry', () => {
  beforeEach(() => {
    getOptionalSessionFnMock.mockReset()
  })

  it('does nothing when no active session exists', async () => {
    getOptionalSessionFnMock.mockResolvedValueOnce(null)

    await expect(redirectAuthenticatedAuthEntry('/admin')).resolves.toBeUndefined()
  })

  it('redirects authenticated users to safe requested path', async () => {
    getOptionalSessionFnMock.mockResolvedValueOnce({
      user: {
        role: 'admin',
      },
    } as never)

    await expect(
      redirectAuthenticatedAuthEntry('/admin/content/posts'),
    ).rejects.toMatchObject({
      options: {
        to: '/admin/content/posts',
      },
    })
  })

  it('falls back to role landing when redirect is unsafe', async () => {
    getOptionalSessionFnMock.mockResolvedValueOnce({
      user: {
        role: 'admin',
      },
    } as never)

    await expect(
      redirectAuthenticatedAuthEntry('https://evil.example'),
    ).rejects.toMatchObject({
      options: {
        to: '/admin/dashboard',
      },
    })
  })
})
