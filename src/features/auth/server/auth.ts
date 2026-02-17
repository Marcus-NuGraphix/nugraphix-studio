import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import {
  AUTH_COOKIE_PREFIX,
  AUTH_IP_ADDRESS_HEADERS,
  AUTH_RATE_LIMIT_OPTIONS,
  MINIMUM_BETTER_AUTH_SECRET_LENGTH,
  assertAuthSecretStrength,
  buildTrustedOrigins,
  deriveSecureCookieFlag,
  toPublicResetUrl,
} from './auth-config'
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '@/features/email/server/workflows.server'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { env } from '@/lib/env/server'
import { logger } from '@/lib/observability'

const authLogger = logger.child({ domain: 'auth' })

const trustedOrigins = buildTrustedOrigins(env)
const useSecureCookies = deriveSecureCookieFlag(env.BETTER_AUTH_BASE_URL)

const secretStatus = assertAuthSecretStrength(env)
if (!secretStatus.valid && env.NODE_ENV === 'development') {
  authLogger.warn('auth.config.secret.weak-non-production', {
    minimumLength: MINIMUM_BETTER_AUTH_SECRET_LENGTH,
    currentLength: secretStatus.secretLength,
  })
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  rateLimit: AUTH_RATE_LIMIT_OPTIONS,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: (data) => {
      const resetUrl = toPublicResetUrl({
        token: data.token,
        generatedUrl: data.url,
        runtimeEnv: env,
      })

      void sendResetPasswordEmail({
        user: data.user,
        resetUrl,
      }).catch((error) => {
        authLogger.error('auth.email.reset-password.failed', {
          userId: data.user.id,
          error,
        })
      })

      return Promise.resolve()
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: (data) => {
      void sendVerificationEmail({
        user: data.user,
        verificationUrl: data.url,
      }).catch((error) => {
        authLogger.error('auth.email.verification.failed', {
          userId: data.user.id,
          error,
        })
      })

      return Promise.resolve()
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: (createdUser) => {
          void sendWelcomeEmail(createdUser).catch((error) => {
            authLogger.error('auth.email.welcome.failed', {
              userId: createdUser.id,
              error,
            })
          })

          return Promise.resolve()
        },
      },
    },
  },
  advanced: {
    cookiePrefix: AUTH_COOKIE_PREFIX,
    useSecureCookies,
    ipAddress: {
      ipAddressHeaders: [...AUTH_IP_ADDRESS_HEADERS],
    },
  },
  plugins: [
    tanstackStartCookies(),
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
})
