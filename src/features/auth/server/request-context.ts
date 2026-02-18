import {
  buildScopedRateLimitKey,
  getClientIpFromHeaders,
  getUserAgentFromHeaders,
  toHeaders,
} from '@/lib/server/request-context'

export const buildAuthRateLimitKey = (
  scope: string,
  headers: Headers,
  ...parts: Array<string | number>
) => {
  return buildScopedRateLimitKey({
    namespace: 'auth',
    scope,
    headers,
    parts,
  })
}
export { getClientIpFromHeaders, getUserAgentFromHeaders, toHeaders }
