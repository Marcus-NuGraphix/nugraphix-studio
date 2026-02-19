import { redirect } from '@tanstack/react-router'
import { resolvePostAuthRedirect } from '@/features/auth/model/post-auth'
import { getOptionalSessionFn } from '@/features/auth/server/session'

export const redirectAuthenticatedAuthEntry = async (
  requestedRedirect?: string,
) => {
  const session = await getOptionalSessionFn()

  if (!session) {
    return
  }

  throw redirect({
    to: resolvePostAuthRedirect({
      requestedRedirect,
      role: session.user.role,
    }),
  })
}
