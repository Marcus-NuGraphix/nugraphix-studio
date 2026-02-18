import { describe, expect, it } from 'vitest'
import {
  ADMIN_BASE_PATH,
  ADMIN_DOCS_BASE_PATH,
  APP_ID,
  APP_NAME,
} from '@/lib/constants'

describe('lib/constants', () => {
  it('exposes stable app identity constants', () => {
    expect(APP_ID).toBe('nugraphix-studio')
    expect(APP_NAME).toBe('Nu Graphix Studio')
  })

  it('exposes shared admin route constants', () => {
    expect(ADMIN_BASE_PATH).toBe('/admin')
    expect(ADMIN_DOCS_BASE_PATH).toBe('/admin/workspaces/platform/docs')
  })
})
