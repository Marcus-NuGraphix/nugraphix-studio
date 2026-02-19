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

const toOrigin = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  try {
    return new URL(value).origin
  } catch {
    throw new Error(`${label} must be a valid URL.`)
  }
}

const isSecureOrigin = (origin: string) => origin.startsWith('https://')

export const buildTrustedOrigins = (
  runtimeEnv: Pick<
    AuthRuntimeEnv,
    'BETTER_AUTH_URL' | 'BETTER_AUTH_BASE_URL' | 'BETTER_AUTH_TRUSTED_ORIGINS'
  >,
) => {
  const rawOrigins = [
    runtimeEnv.BETTER_AUTH_URL,
    runtimeEnv.BETTER_AUTH_BASE_URL,
    ...(runtimeEnv.BETTER_AUTH_TRUSTED_ORIGINS ?? []),
  ]

  return Array.from(
    new Set([
      ...rawOrigins.map((origin, index) =>
        toOrigin({
          label: `trusted origin at index ${index}`,
          value: origin,
        }),
      ),
    ]),
  )
}

export const deriveSecureCookieFlag = (baseUrl: string) =>
  baseUrl.startsWith('https://')

export const resolveSecureCookieFlag = (
  runtimeEnv: Pick<AuthRuntimeEnv, 'NODE_ENV' | 'BETTER_AUTH_BASE_URL'>,
) => {
  const useSecureCookies = deriveSecureCookieFlag(runtimeEnv.BETTER_AUTH_BASE_URL)

  if (runtimeEnv.NODE_ENV === 'production' && !useSecureCookies) {
    throw new Error('BETTER_AUTH_BASE_URL must use HTTPS in production.')
  }

  return useSecureCookies
}

export const assertTrustedOriginsSecurity = ({
  runtimeEnv,
  origins,
}: {
  runtimeEnv: Pick<AuthRuntimeEnv, 'NODE_ENV'>
  origins: Array<string>
}) => {
  if (runtimeEnv.NODE_ENV !== 'production') {
    return
  }

  const insecureOrigins = origins.filter((origin) => !isSecureOrigin(origin))

  if (insecureOrigins.length > 0) {
    throw new Error(
      `BETTER_AUTH_URL and BETTER_AUTH_TRUSTED_ORIGINS must use HTTPS in production. Invalid origins: ${insecureOrigins.join(', ')}`,
    )
  }
}

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
