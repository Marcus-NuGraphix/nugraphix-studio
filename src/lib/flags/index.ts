export interface FeatureFlags {
  adminWorkspaces: boolean
  strictA11yAudit: boolean
  useStructuredNavAdapters: boolean
}

export const featureFlagDefaults: FeatureFlags = {
  adminWorkspaces: false,
  strictA11yAudit: false,
  useStructuredNavAdapters: false,
}
export type FeatureFlagKey = keyof FeatureFlags

export const createFeatureFlags = (
  overrides: Partial<FeatureFlags> = {},
): FeatureFlags => {
  return {
    ...featureFlagDefaults,
    ...overrides,
  }
}

export const featureFlags = Object.freeze(createFeatureFlags())

const truthyValues = new Set(['1', 'true', 'yes', 'on'])
const falsyValues = new Set(['0', 'false', 'no', 'off'])

export const parseFeatureFlagBoolean = (
  value: unknown,
): boolean | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return undefined
  }

  if (truthyValues.has(normalized)) {
    return true
  }

  if (falsyValues.has(normalized)) {
    return false
  }

  return undefined
}

export const isFeatureFlagEnabled = (key: FeatureFlagKey): boolean => {
  return featureFlags[key]
}
