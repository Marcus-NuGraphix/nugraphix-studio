import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdminUser } from '@/features/auth/server/admin-api'
import { auth } from '@/features/auth/server/auth'

vi.mock('@/features/auth/server/auth', () => ({
  auth: {
    api: {},
  },
}))

describe('createAdminUser', () => {
  const authApi = auth.api as unknown as {
    createUser?: (input: unknown) => Promise<unknown>
  }

  beforeEach(() => {
    delete authApi.createUser
  })

  it('throws when admin create-user endpoint is unavailable', async () => {
    await expect(
      createAdminUser({
        headers: new Headers(),
        email: 'new-user@example.com',
        password: 'SecurePass123',
        name: 'New User',
        role: 'user',
      }),
    ).rejects.toMatchObject({
      code: 'INTERNAL',
      message: 'Better Auth admin create-user endpoint is not available.',
    })
  })

  it('forwards payload to Better Auth createUser endpoint', async () => {
    const createUserMock = vi.fn().mockResolvedValue({
      user: {
        id: 'user_123',
        email: 'new-user@example.com',
        name: 'New User',
        role: 'user',
      },
    })
    authApi.createUser = createUserMock as (input: unknown) => Promise<unknown>

    const headers = new Headers({ cookie: 'session=abc' })
    const result = await createAdminUser({
      headers,
      email: 'new-user@example.com',
      password: 'SecurePass123',
      name: 'New User',
      role: 'admin',
    })

    expect(createUserMock).toHaveBeenCalledWith({
      body: {
        email: 'new-user@example.com',
        password: 'SecurePass123',
        name: 'New User',
        role: 'admin',
      },
      headers,
    })
    expect(result.user.id).toBe('user_123')
  })

  it('maps duplicate-email endpoint errors to CONFLICT', async () => {
    const createUserMock = vi
      .fn()
      .mockRejectedValue(new Error('User already exists'))
    authApi.createUser = createUserMock as (input: unknown) => Promise<unknown>

    await expect(
      createAdminUser({
        headers: new Headers(),
        email: 'new-user@example.com',
        password: 'SecurePass123',
        name: 'New User',
        role: 'user',
      }),
    ).rejects.toMatchObject({
      code: 'CONFLICT',
      message: 'An account with this email already exists.',
    })
  })
})
