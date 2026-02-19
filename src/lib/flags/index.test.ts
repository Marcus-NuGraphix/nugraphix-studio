import { describe, expect, it } from 'vitest'
import {
  createFeatureFlags,
  featureFlagDefaults,
  isFeatureFlagEnabled,
  parseFeatureFlagBoolean,
} from '@/lib/flags'

describe('lib/flags', () => {
  it('applies overrides over defaults', () => {
    const flags = createFeatureFlags({
      adminWorkspaces: true,
    })

    expect(flags.adminWorkspaces).toBe(true)
    expect(flags.strictA11yAudit).toBe(featureFlagDefaults.strictA11yAudit)
  })

  it('parses boolean-like string values', () => {
    expect(parseFeatureFlagBoolean('true')).toBe(true)
    expect(parseFeatureFlagBoolean('YES')).toBe(true)
    expect(parseFeatureFlagBoolean('0')).toBe(false)
    expect(parseFeatureFlagBoolean('off')).toBe(false)
    expect(parseFeatureFlagBoolean('')).toBeUndefined()
    expect(parseFeatureFlagBoolean('unknown')).toBeUndefined()
  })

  it('reads default flag states through helper', () => {
    expect(isFeatureFlagEnabled('adminWorkspaces')).toBe(
      featureFlagDefaults.adminWorkspaces,
    )
  })
})
