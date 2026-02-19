import type { FeatureFlags } from '@/lib/flags'
import {
  ADMIN_BASE_PATH,
  ADMIN_DOCS_BASE_PATH,
  APP_ID,
  APP_NAME,
} from '@/lib/constants'
import { createFeatureFlags, featureFlags } from '@/lib/flags'

export interface AppConfig {
  identity: {
    id: string
    name: string
  }
  routes: {
    admin: string
    adminDocs: string
  }
  features: FeatureFlags
}

export interface AppConfigOverrides {
  appId?: string
  appName?: string
  adminBasePath?: string
  adminDocsBasePath?: string
  featureFlags?: Partial<FeatureFlags>
}

export const createAppConfig = (
  overrides: AppConfigOverrides = {},
): AppConfig => {
  return {
    identity: {
      id: overrides.appId ?? APP_ID,
      name: overrides.appName ?? APP_NAME,
    },
    routes: {
      admin: overrides.adminBasePath ?? ADMIN_BASE_PATH,
      adminDocs: overrides.adminDocsBasePath ?? ADMIN_DOCS_BASE_PATH,
    },
    features: createFeatureFlags({
      ...featureFlags,
      ...overrides.featureFlags,
    }),
  }
}

export const appConfig = Object.freeze(createAppConfig())
