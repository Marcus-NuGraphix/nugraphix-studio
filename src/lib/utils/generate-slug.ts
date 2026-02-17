interface GenerateSlugOptions {
  fallback?: string
  maxLength?: number
}

const normalizeToAscii = (value: string) =>
  value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

const trimSeparatorEdges = (value: string, separator: string) => {
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const edgePattern = new RegExp(`^${escapedSeparator}+|${escapedSeparator}+$`, 'g')
  return value.replace(edgePattern, '')
}

export function generateSlug(
  title: string,
  options: GenerateSlugOptions = {},
): string {
  const fallback = options.fallback ?? 'untitled'
  const maxLength = options.maxLength ?? 80

  const slugBase = normalizeToAscii(title)
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')

  const trimmed = trimSeparatorEdges(slugBase, '-')
  const sliced = trimmed.slice(0, Math.max(1, maxLength))
  const normalized = trimSeparatorEdges(sliced, '-')

  return normalized || fallback
}
