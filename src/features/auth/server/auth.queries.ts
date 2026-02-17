import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import type { ServerResult } from '@/lib/errors/serverResult'
import { getSessionFromHeaders } from '@/lib/auth/session'
import { ok } from '@/lib/errors/serverResult'
import { toServerFail } from '@/lib/errors/toServerFail'

export type SessionUserDTO = {
  id: string
  email?: string | null
}

export const authGetSessionFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ServerResult<{ user: SessionUserDTO | null }>> => {
    try {
      const headers = getRequestHeaders()
      const session = await getSessionFromHeaders(headers)

      const user = session?.user
        ? {
            id: String((session.user as any).id ?? ''),
            email: (session.user as any).email ?? null,
          }
        : null

      return ok({ user })
    } catch (err) {
      return toServerFail(err)
    }
  },
)
