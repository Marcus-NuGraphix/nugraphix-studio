import { describe, expect, it } from 'vitest'
import { roleValues } from '@/features/auth/model/session'
import { userStatusValues } from '@/features/users/model/filters'

describe('roleValues', () => {
  it('supports only user/admin roles', () => {
    expect(roleValues).toEqual(['user', 'admin'])
  })
})

describe('userStatusValues', () => {
  it('supports production user lifecycle states', () => {
    expect(userStatusValues).toEqual(['active', 'suspended', 'invited'])
  })
})
