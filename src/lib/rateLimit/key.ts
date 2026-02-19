export const buildRateLimitKey = (...parts: Array<string | number>) =>
  parts
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join(':')
