import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { auth } from '@/features/auth/server/auth'
import { checkAuthRateLimit } from '@/features/auth/server/rate-limit'
import {
  getClientIpFromHeaders,
  getUserAgentFromHeaders,
} from '@/features/auth/server/request-context'
import { passwordPolicySchema } from '@/features/auth/schemas/password'
import { AppError } from '@/lib/errors'
import { logMutationResult, logger } from '@/lib/observability'

const authSecurityLogger = logger.child({ domain: 'auth-security' })

const changePasswordInputSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: passwordPolicySchema,
  revokeOtherSessions: z.boolean().optional(),
})

const revokeSessionTokenSchema = z.string().trim().min(1)

const isAuthErrorCode = (
  value: unknown,
): value is 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'RATE_LIMITED' => {
  return (
    value === 'UNAUTHORIZED' ||
    value === 'FORBIDDEN' ||
    value === 'NOT_FOUND' ||
    value === 'RATE_LIMITED'
  )
}

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    const message = (error as { message: string }).message.trim()
    if (message) {
      return message
    }
  }

  return ''
}

const toAuthAppError = ({
  error,
  defaultCode,
  defaultMessage,
}: {
  error: unknown
  defaultCode: 'UNAUTHORIZED' | 'NOT_FOUND' | 'INTERNAL'
  defaultMessage: string
}) => {
  if (error instanceof AppError) {
    return error
  }

  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    isAuthErrorCode((error as { code?: unknown }).code)
  ) {
    const payload = error as { code?: unknown; message?: unknown }
    const code = payload.code as
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'RATE_LIMITED'
    const message = typeof payload.message === 'string'
      ? payload.message
      : defaultMessage

    return new AppError(code, message, { cause: error })
  }

  const message = toErrorMessage(error).toLowerCase()

  if (
    message.includes('invalid current password') ||
    message.includes('invalid password') ||
    message.includes('incorrect password')
  ) {
    return new AppError('VALIDATION_ERROR', 'Current password is incorrect.', {
      cause: error,
    })
  }

  if (
    message.includes('unauthorized') ||
    message.includes('not authenticated') ||
    message.includes('authentication required')
  ) {
    return new AppError(
      'UNAUTHORIZED',
      'You must be signed in to perform this action.',
      { cause: error },
    )
  }

  if (
    message.includes('invalid token') ||
    message.includes('session not found') ||
    message.includes('token not found')
  ) {
    return new AppError('NOT_FOUND', 'Session could not be found.', {
      cause: error,
    })
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return new AppError(
      'RATE_LIMITED',
      'Too many attempts. Please wait before retrying.',
      {
        cause: error,
      },
    )
  }

  return new AppError(defaultCode, defaultMessage, { cause: error })
}

const getElapsedMs = (startTime: number) => Math.max(0, Date.now() - startTime)

export const changePasswordForCurrentUser = async ({
  currentPassword,
  newPassword,
  revokeOtherSessions,
}: {
  currentPassword: string
  newPassword: string
  revokeOtherSessions?: boolean
}) => {
  const startTime = Date.now()
  const input = changePasswordInputSchema.parse({
    currentPassword,
    newPassword,
    revokeOtherSessions,
  })
  const headers = getRequestHeaders()
  const clientIp = getClientIpFromHeaders(headers)
  const userAgent = getUserAgentFromHeaders(headers)

  const rateLimit = await checkAuthRateLimit({
    scope: 'password-change',
    headers,
    limit: 10,
    windowMs: 60_000,
  })

  if (!rateLimit.allowed) {
    const error = new AppError(
      'RATE_LIMITED',
      'Too many password change attempts. Please wait a minute.',
    )

    logMutationResult(authSecurityLogger, {
      feature: 'auth',
      action: 'change-password',
      result: 'fail',
      errorCode: error.code,
      executionTimeMs: getElapsedMs(startTime),
      userId: null,
    })

    throw error
  }

  try {
    const result = await auth.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        revokeOtherSessions: input.revokeOtherSessions,
      },
      headers,
    })

    logMutationResult(authSecurityLogger, {
      feature: 'auth',
      action: 'change-password',
      result: 'ok',
      executionTimeMs: getElapsedMs(startTime),
      userId: null,
    })

    return result
  } catch (error) {
    const mappedError = toAuthAppError({
      error,
      defaultCode: 'INTERNAL',
      defaultMessage: 'Unable to change password right now.',
    })

    logMutationResult(authSecurityLogger, {
      feature: 'auth',
      action: 'change-password',
      result: 'fail',
      errorCode: mappedError.code,
      executionTimeMs: getElapsedMs(startTime),
      userId: null,
    })

    authSecurityLogger.warn('auth-security.password-change.failed', {
      error: mappedError,
      clientIp,
      userAgent,
      rateLimitRemaining: rateLimit.remaining,
      rateLimitResetAt: rateLimit.resetAt,
    })

    throw mappedError
  }
}

export const listCurrentUserSessions = async () => {
  const headers = getRequestHeaders()

  try {
    return await auth.api.listSessions({ headers })
  } catch (error) {
    throw toAuthAppError({
      error,
      defaultCode: 'UNAUTHORIZED',
      defaultMessage: 'You must be signed in to view sessions.',
    })
  }
}

export const revokeCurrentUserSession = async (token: string) => {
  const startTime = Date.now()
  const headers = getRequestHeaders()
  const validatedToken = revokeSessionTokenSchema.parse(token)

  try {
    const result = await auth.api.revokeSession({
      body: { token: validatedToken },
      headers,
    })

    logMutationResult(authSecurityLogger, {
      feature: 'auth',
      action: 'revoke-session',
      result: 'ok',
      executionTimeMs: getElapsedMs(startTime),
      userId: null,
    })

    return result
  } catch (error) {
    const mappedError = toAuthAppError({
      error,
      defaultCode: 'NOT_FOUND',
      defaultMessage: 'Session could not be revoked.',
    })

    logMutationResult(authSecurityLogger, {
      feature: 'auth',
      action: 'revoke-session',
      result: 'fail',
      errorCode: mappedError.code,
      executionTimeMs: getElapsedMs(startTime),
      userId: null,
    })

    throw mappedError
  }
}

export const revokeAllCurrentUserSessions = async () => {
  const startTime = Date.now()
  const headers = getRequestHeaders()

  try {
    const result = await auth.api.revokeSessions({ headers })

    logMutationResult(authSecurityLogger, {
      feature: 'auth',
      action: 'revoke-all-sessions',
      result: 'ok',
      executionTimeMs: getElapsedMs(startTime),
      userId: null,
    })

    return result
  } catch (error) {
    const mappedError = toAuthAppError({
      error,
      defaultCode: 'UNAUTHORIZED',
      defaultMessage: 'Unable to revoke sessions right now.',
    })

    logMutationResult(authSecurityLogger, {
      feature: 'auth',
      action: 'revoke-all-sessions',
      result: 'fail',
      errorCode: mappedError.code,
      executionTimeMs: getElapsedMs(startTime),
      userId: null,
    })

    throw mappedError
  }
}
