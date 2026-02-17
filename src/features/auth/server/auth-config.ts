import { toSafeRedirectPath } from '@/features/auth/model/redirect'

export const AUTH_RATE_LIMIT_OPTIONS = Object.freeze({
  enabled: true,
  storage: 'database' as const,
  window: 60,
  max: 100,
})

export const AUTH_COOKIE_PREFIX = 'app'

export const AUTH_IP_ADDRESS_HEADERS = [
  'cf-connecting-ip',
  'x-forwarded-for',
  'x-real-ip',
] as const

export const MINIMUM_BETTER_AUTH_SECRET_LENGTH = 32

export interface AuthRuntimeEnv {
  NODE_ENV: 'development' | 'test' | 'production'
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  BETTER_AUTH_BASE_URL: string
  BETTER_AUTH_TRUSTED_ORIGINS?: Array<string>
  PUBLIC_APP_URL?: string
}

export const buildTrustedOrigins = (
  runtimeEnv: Pick<
    AuthRuntimeEnv,
    'BETTER_AUTH_URL' | 'BETTER_AUTH_BASE_URL' | 'BETTER_AUTH_TRUSTED_ORIGINS'
  >,
) => {
  return Array.from(
    new Set([
      runtimeEnv.BETTER_AUTH_URL,
      runtimeEnv.BETTER_AUTH_BASE_URL,
      ...(runtimeEnv.BETTER_AUTH_TRUSTED_ORIGINS ?? []),
    ]),
  )
}

export const deriveSecureCookieFlag = (baseUrl: string) =>
  baseUrl.startsWith('https://')

export const resolvePublicAppOrigin = (
  runtimeEnv: Pick<AuthRuntimeEnv, 'PUBLIC_APP_URL' | 'BETTER_AUTH_BASE_URL'>,
) => (runtimeEnv.PUBLIC_APP_URL || runtimeEnv.BETTER_AUTH_BASE_URL).replace(/\/$/, '')

export const assertAuthSecretStrength = (
  runtimeEnv: Pick<AuthRuntimeEnv, 'NODE_ENV' | 'BETTER_AUTH_SECRET'>,
) => {
  const secretLength = runtimeEnv.BETTER_AUTH_SECRET.trim().length

  if (secretLength >= MINIMUM_BETTER_AUTH_SECRET_LENGTH) {
    return { valid: true as const, secretLength }
  }

  if (runtimeEnv.NODE_ENV === 'production') {
    throw new Error(
      `BETTER_AUTH_SECRET must be at least ${MINIMUM_BETTER_AUTH_SECRET_LENGTH} characters in production.`,
    )
  }

  return { valid: false as const, secretLength }
}

export const toPublicResetUrl = ({
  token,
  generatedUrl,
  runtimeEnv,
}: {
  token: string
  generatedUrl: string
  runtimeEnv: Pick<
    AuthRuntimeEnv,
    'PUBLIC_APP_URL' | 'BETTER_AUTH_BASE_URL'
  >
}) => {
  try {
    const authUrl = new URL(generatedUrl)
    const callbackURL = authUrl.searchParams.get('callbackURL')
    const publicResetUrl = new URL(
      '/reset-password/',
      `${resolvePublicAppOrigin(runtimeEnv)}/`,
    )

    publicResetUrl.searchParams.set('token', token)

    if (callbackURL) {
      const safeCallbackPath = toSafeRedirectPath(callbackURL, '')
      if (safeCallbackPath) {
        publicResetUrl.searchParams.set('callbackURL', safeCallbackPath)
      }
    }

    return publicResetUrl.toString()
  } catch {
    return generatedUrl
  }
}
