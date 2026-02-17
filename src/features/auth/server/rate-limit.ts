import { checkRateLimit as checkSharedRateLimit } from '@/features/shared/server/rate-limit.server'

export const checkRateLimit = ({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}) => {
  return checkSharedRateLimit({ key, limit, windowMs })
}
