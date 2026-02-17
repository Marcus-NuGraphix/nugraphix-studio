import type { auth } from '@/features/auth/server/auth'

export const roleValues = ['user', 'admin'] as const
export type UserRole = (typeof roleValues)[number]

type RawSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

export type AppSession = Omit<RawSession, 'user'> & {
  user: RawSession['user'] & { role: UserRole }
}
