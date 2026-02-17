import { describe, expect, it } from 'vitest'
import { buildRateLimitKey } from '@/lib/rateLimit/key'

describe('rateLimit key helpers', () => {
  it('builds stable colon-separated keys', () => {
    expect(buildRateLimitKey('contact', 'form', 'user@example.com')).toBe(
      'contact:form:user@example.com',
    )
  })

  it('removes empty key segments', () => {
    expect(buildRateLimitKey('contact', '', 'lead')).toBe('contact:lead')
  })
})
