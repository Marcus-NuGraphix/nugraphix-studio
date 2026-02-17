interface GetInitialsOptions {
  fallback?: string
  maxInitials?: number
}

const splitNameParts = (value: string) =>
  value
    .split(/[\s._-]+/g)
    .map((part) => part.trim())
    .filter(Boolean)

export function getInitials(
  name: string,
  options: GetInitialsOptions = {},
): string {
  const fallback = options.fallback ?? '?'
  const maxInitials = Math.max(1, Math.min(options.maxInitials ?? 2, 3))

  const normalizedName = name.trim()
  if (normalizedName.length === 0) {
    return fallback
  }

  const safeName = normalizedName.includes('@')
    ? normalizedName.split('@')[0]
    : normalizedName

  const parts = splitNameParts(safeName)
  if (parts.length === 0) {
    return fallback
  }

  if (parts.length === 1) {
    return parts[0].slice(0, maxInitials).toUpperCase()
  }

  const initials = [parts[0], ...parts.slice(1).reverse()]
    .slice(0, maxInitials)
    .map((part) => part[0].toUpperCase())
    .join('')

  return initials || fallback
}
