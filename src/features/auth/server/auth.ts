import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '@/features/email/server/workflows.server'
import * as schema from '@/lib/db'
import { db } from '@/lib/db'
import { env } from '@/lib/env/server'
import { logger } from '@/lib/observability'

const authLogger = logger.child({ domain: 'auth' })

const trustedOrigins = Array.from(
  new Set([
    env.BETTER_AUTH_URL,
    env.BETTER_AUTH_BASE_URL,
    ...(env.BETTER_AUTH_TRUSTED_ORIGINS ?? []),
  ]),
)

const useSecureCookies = env.BETTER_AUTH_BASE_URL.startsWith('https://')

const getPublicAppOrigin = () =>
  (env.PUBLIC_APP_URL || env.BETTER_AUTH_BASE_URL).replace(/\/$/, '')

const toPublicResetUrl = ({
  token,
  generatedUrl,
}: {
  token: string
  generatedUrl: string
}) => {
  try {
    const authUrl = new URL(generatedUrl)
    const callbackURL = authUrl.searchParams.get('callbackURL')
    const publicResetUrl = new URL(
      `/reset-password/${token}`,
      `${getPublicAppOrigin()}/`,
    )

    if (callbackURL) {
      publicResetUrl.searchParams.set('callbackURL', callbackURL)
    }

    return publicResetUrl.toString()
  } catch {
    return generatedUrl
  }
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  rateLimit: {
    enabled: true,
    storage: 'database',
    window: 60,
    max: 100,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async (data) => {
      const resetUrl = toPublicResetUrl({
        token: data.token,
        generatedUrl: data.url,
      })

      try {
        await sendResetPasswordEmail({
          user: data.user,
          resetUrl,
        })
      } catch (error) {
        authLogger.error('auth.email.reset-password.failed', {
          userId: data.user.id,
          error,
        })
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async (data) => {
      try {
        await sendVerificationEmail({
          user: data.user,
          verificationUrl: data.url,
        })
      } catch (error) {
        authLogger.error('auth.email.verification.failed', {
          userId: data.user.id,
          error,
        })
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          try {
            await sendWelcomeEmail(createdUser)
          } catch (error) {
            authLogger.error('auth.email.welcome.failed', {
              userId: createdUser.id,
              error,
            })
          }
        },
      },
    },
  },
  advanced: {
    cookiePrefix: 'app',
    useSecureCookies,
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
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
