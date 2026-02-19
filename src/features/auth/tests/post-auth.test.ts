import { describe, expect, it } from 'vitest'
import {
  getRoleLandingPath,
  resolvePostAuthRedirect,
  toUserRole,
  toUserRoleFromClientSession,
} from '@/features/auth/model/post-auth'

describe('post-auth redirect helpers', () => {
  it('maps admin role to dashboard landing route', () => {
    expect(getRoleLandingPath('admin')).toBe(
      '/admin/workspaces/operations/dashboard',
    )
  })

  it('maps user role to blog landing route', () => {
    expect(getRoleLandingPath('user')).toBe('/blog')
  })

  it('uses safe explicit redirect paths when provided', () => {
    expect(
      resolvePostAuthRedirect({
        requestedRedirect: '/admin/content/posts',
        role: 'admin',
      }),
    ).toBe('/admin/content/posts')
  })

  it('falls back to role landing when redirect is unsafe', () => {
    expect(
      resolvePostAuthRedirect({
        requestedRedirect: 'https://evil.com',
        role: 'user',
      }),
    ).toBe('/blog')
  })

  it('normalizes unknown role-like values to user', () => {
    expect(toUserRole('owner')).toBe('user')
  })

  it('resolves role from client session payload', () => {
    expect(toUserRoleFromClientSession({ user: { role: 'admin' } })).toBe(
      'admin',
    )
    expect(toUserRoleFromClientSession({ user: { role: 'something-else' } })).toBe(
      'user',
    )
    expect(toUserRoleFromClientSession(null)).toBe('user')
  })
})
