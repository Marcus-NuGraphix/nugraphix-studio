import { getRequestHeaders } from '@tanstack/react-start/server'
import type { RateLimitResult } from '@/lib/rateLimit'
import { checkRateLimit as checkSharedRateLimit } from '@/lib/rateLimit'
import { buildAuthRateLimitKey, toHeaders } from '@/features/auth/server/request-context'

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

export const checkAuthRateLimit = ({
  scope,
  limit,
  windowMs,
  headers = getRequestHeaders(),
  keyParts = [],
}: {
  scope: string
  limit: number
  windowMs: number
  headers?: Headers
  keyParts?: Array<string | number>
}): Promise<RateLimitResult> => {
  const resolvedHeaders = toHeaders(headers)
  const key = buildAuthRateLimitKey(scope, resolvedHeaders, ...keyParts)

  return checkSharedRateLimit({ key, limit, windowMs })
}
