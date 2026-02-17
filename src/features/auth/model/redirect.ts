const FALLBACK_REDIRECT_PATH = '/'
const MAX_REDIRECT_LENGTH = 2048

const hasUnsafeProtocol = (value: string) => /[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)

export const toSafeRedirectPath = (
  value: unknown,
  fallback = FALLBACK_REDIRECT_PATH,
) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  if (!trimmed || trimmed.length > MAX_REDIRECT_LENGTH) {
    return fallback
  }

  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return fallback
  }

  if (hasUnsafeProtocol(trimmed)) {
    return fallback
  }

  return trimmed
}
