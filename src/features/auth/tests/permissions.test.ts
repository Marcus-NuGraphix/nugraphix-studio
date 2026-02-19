import { describe, expect, it } from 'vitest'
import type { Permission } from '@/features/auth/model/permissions'
import {
  hasPermission,
  permissionValues,
} from '@/features/auth/model/permissions'
import { roleValues } from '@/features/auth/model/session'

describe('permissions', () => {
  describe('permissionValues', () => {
    it('exports all expected permissions', () => {
      expect(permissionValues).toContain('users.read')
      expect(permissionValues).toContain('users.write')
      expect(permissionValues).toContain('users.delete')
      expect(permissionValues).toContain('users.sessions.revoke')
      expect(permissionValues).toContain('account.update')
      expect(permissionValues).toContain('account.security.manage')
    })

    it('has exactly 6 permissions', () => {
      expect(permissionValues).toHaveLength(6)
    })
  })

  describe('hasPermission', () => {
    const adminOnlyPermissions: Array<Permission> = [
      'users.read',
      'users.write',
      'users.delete',
      'users.sessions.revoke',
    ]

    const sharedPermissions: Array<Permission> = [
      'account.update',
      'account.security.manage',
    ]

    it.each(adminOnlyPermissions)(
      'grants admin the %s permission',
      (permission) => {
        expect(hasPermission('admin', permission)).toBe(true)
      },
    )

    it.each(adminOnlyPermissions)(
      'denies user the %s permission',
      (permission) => {
        expect(hasPermission('user', permission)).toBe(false)
      },
    )

    it.each(sharedPermissions)(
      'grants both admin and user the %s permission',
      (permission) => {
        expect(hasPermission('admin', permission)).toBe(true)
        expect(hasPermission('user', permission)).toBe(true)
      },
    )

    it('covers every permission for every role', () => {
      for (const role of roleValues) {
        for (const permission of permissionValues) {
          expect(() => hasPermission(role, permission)).not.toThrow()
        }
      }
    })

    it('admin has all permissions', () => {
      const adminPermissions = permissionValues.filter((p) =>
        hasPermission('admin', p),
      )
      expect(adminPermissions).toHaveLength(permissionValues.length)
    })

    it('user has exactly 2 permissions', () => {
      const userPermissions = permissionValues.filter((p) =>
        hasPermission('user', p),
      )
      expect(userPermissions).toHaveLength(2)
      expect(userPermissions).toEqual(
        expect.arrayContaining(['account.update', 'account.security.manage']),
      )
    })
  })
})
