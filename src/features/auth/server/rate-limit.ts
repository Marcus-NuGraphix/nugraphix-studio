import { checkRateLimit as checkSharedRateLimit } from '@/lib/rateLimit'

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
