import { getRequestHeaders } from '@tanstack/react-start/server'
import { checkRateLimit } from '@/features/auth/server/rate-limit'
import { auth } from '@/features/auth/server/auth'

export const changePasswordForCurrentUser = async ({
  currentPassword,
  newPassword,
  revokeOtherSessions,
}: {
  currentPassword: string
  newPassword: string
  revokeOtherSessions?: boolean
}) => {
  const headers = getRequestHeaders()
  const rateLimit = await checkRateLimit({
    key: `password-change:${headers.get('x-forwarded-for') ?? 'local'}`,
    limit: 10,
    windowMs: 60_000,
  })

  if (!rateLimit.allowed) {
    throw new Error('Too many password change attempts. Please wait a minute.')
  }

  return auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions,
    },
    headers,
  })
}

export const listCurrentUserSessions = async () => {
  const headers = getRequestHeaders()
  return auth.api.listSessions({ headers })
}

export const revokeCurrentUserSession = async (token: string) => {
  const headers = getRequestHeaders()
  return auth.api.revokeSession({ body: { token }, headers })
}

export const revokeAllCurrentUserSessions = async () => {
  const headers = getRequestHeaders()
  return auth.api.revokeSessions({ headers })
}
