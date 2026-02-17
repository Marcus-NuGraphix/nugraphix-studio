import { createServerFn } from '@tanstack/react-start'

export type { AppSession, UserRole } from '@/features/auth/model/session'
export { roleValues } from '@/features/auth/model/session'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { requireSession } = await import('./session.server')
    return requireSession()
  },
)

export const getOptionalSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getOptionalSession } = await import('./session.server')
    return getOptionalSession()
  },
)

export const getAdminSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { requireAdmin } = await import('./session.server')
    return requireAdmin()
  },
)
