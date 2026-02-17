import { getRequestHeaders } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import type { AppSession } from '@/features/auth/model/session'
import { auth } from '@/features/auth/server/auth'

type RawSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

const normalizeRole = (role: unknown): AppSession['user']['role'] =>
  role === 'admin' ? 'admin' : 'user'

const withRole = (session: RawSession): AppSession => ({
  ...session,
  user: {
    ...session.user,
    role: normalizeRole(session.user.role),
  },
})

export const getOptionalSession = async (): Promise<AppSession | null> => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  return session ? withRole(session) : null
}

export const requireSession = async (): Promise<AppSession> => {
  const session = await getOptionalSession()
  if (!session) {
    throw redirect({
      to: '/login',
      search: { redirect: undefined },
    })
  }
  return session
}

export const requireAdmin = async (): Promise<AppSession> => {
  const session = await requireSession()
  if (session.user.role !== 'admin') throw redirect({ to: '/' })
  return session
}
