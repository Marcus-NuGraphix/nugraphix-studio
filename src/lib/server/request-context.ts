import { buildRateLimitKey } from '@/lib/rateLimit/key'

const IP_HEADER_CANDIDATES = [
  'cf-connecting-ip',
  'x-forwarded-for',
  'x-real-ip',
] as const

const FALLBACK_IP = 'local'
const MAX_IP_LENGTH = 128
const MAX_USER_AGENT_LENGTH = 512

const normalizeToken = (value: string | null) => {
  if (!value) {
    return ''
  }

  return value.trim()
}

const sanitizeHeaderValue = (value: string, maxLength: number) =>
  value.trim().slice(0, maxLength)

const pickForwardedIp = (value: string | null) => {
  const token = normalizeToken(value)
  if (!token) {
    return ''
  }

  return sanitizeHeaderValue(token.split(',')[0] ?? '', MAX_IP_LENGTH)
}

export const toHeaders = (source: HeadersInit | Headers) => {
  if (source instanceof Headers) {
    return source
  }

  return new Headers(source)
}

export const getClientIpFromHeaders = (headers: Headers) => {
  for (const header of IP_HEADER_CANDIDATES) {
    const ip = pickForwardedIp(headers.get(header))
    if (ip) {
      return ip
    }
  }

  return FALLBACK_IP
}

export const getUserAgentFromHeaders = (headers: Headers) => {
  const value = normalizeToken(headers.get('user-agent'))
  if (!value) {
    return null
  }

  return sanitizeHeaderValue(value, MAX_USER_AGENT_LENGTH)
}

export const buildScopedRateLimitKey = ({
  namespace,
  scope,
  headers,
  parts = [],
}: {
  namespace: string
  scope: string
  headers: Headers
  parts?: Array<string | number>
}) =>
  buildRateLimitKey(namespace, scope, getClientIpFromHeaders(headers), ...parts)
