import { describe, expect, it } from 'vitest'
import type { AppSession } from '@/features/auth/model/session'
import { permissionValues } from '@/features/auth/model/permissions'
import { assertPermission } from '@/features/auth/server/authorize'

const makeSession = (role: 'admin' | 'user'): AppSession =>
  ({
    user: {
      id: `${role}_1`,
      email: `${role}@example.com`,
      name: `Test ${role}`,
      role,
    },
  }) as AppSession

describe('assertPermission', () => {
  describe('admin session', () => {
    const adminSession = makeSession('admin')

    it.each([...permissionValues])(
      'allows admin the %s permission',
      (permission) => {
        expect(() =>
          assertPermission(adminSession, permission),
        ).not.toThrow()
      },
    )
  })

  describe('user session', () => {
    const userSession = makeSession('user')

    it('allows user the account.update permission', () => {
      expect(() =>
        assertPermission(userSession, 'account.update'),
      ).not.toThrow()
    })

    it('allows user the account.security.manage permission', () => {
      expect(() =>
        assertPermission(userSession, 'account.security.manage'),
      ).not.toThrow()
    })

    it('throws for users.read', () => {
      expect(() => assertPermission(userSession, 'users.read')).toThrow(
        'You are not authorized to perform this action',
      )
    })

    it('throws for users.write', () => {
      expect(() => assertPermission(userSession, 'users.write')).toThrow(
        'You are not authorized to perform this action',
      )
    })

    it('throws for users.delete', () => {
      expect(() => assertPermission(userSession, 'users.delete')).toThrow(
        'You are not authorized to perform this action',
      )
    })

    it('throws for users.sessions.revoke', () => {
      expect(() =>
        assertPermission(userSession, 'users.sessions.revoke'),
      ).toThrow('You are not authorized to perform this action')
    })
  })
})
