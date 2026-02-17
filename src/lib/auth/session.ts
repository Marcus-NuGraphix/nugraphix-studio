import { auth } from '@/lib/auth/auth'
import { AppError } from '@/lib/errors/AppError'

export type RequestHeaders = Record<string, string>

export async function getSessionFromHeaders(headers: RequestHeaders) {
  return await auth.api.getSession({ headers })
}

export async function requireUserFromHeaders(headers: RequestHeaders) {
  const session = await getSessionFromHeaders(headers)
  if (!session?.user)
    throw new AppError('UNAUTHORIZED', 'You must be logged in')
  return session.user
}

export async function requireAdminFromHeaders(headers: RequestHeaders) {
  const user = await requireUserFromHeaders(headers)
  // role checks later
  return user
}
