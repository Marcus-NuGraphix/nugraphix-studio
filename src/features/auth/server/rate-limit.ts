import { checkRateLimit as checkSharedRateLimit } from '@/lib/server/rate-limit'

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
