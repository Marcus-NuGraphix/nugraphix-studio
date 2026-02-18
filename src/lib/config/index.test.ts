import { describe, expect, it } from 'vitest'
import { createAppConfig } from '@/lib/config'

describe('lib/config', () => {
  it('builds default app config values', () => {
    const config = createAppConfig()

    expect(config.identity.id).toBe('nugraphix-studio')
    expect(config.identity.name).toBe('Nu Graphix Studio')
    expect(config.routes.admin).toBe('/admin')
    expect(config.routes.adminDocs).toBe('/admin/docs')
    expect(config.features.adminWorkspaces).toBe(false)
  })

  it('supports scoped overrides for rollout and testing', () => {
    const config = createAppConfig({
      appName: 'Nu Graphix Studio Test',
      featureFlags: {
        adminWorkspaces: true,
      },
    })

    expect(config.identity.name).toBe('Nu Graphix Studio Test')
    expect(config.features.adminWorkspaces).toBe(true)
    expect(config.features.strictA11yAudit).toBe(false)
  })
})
