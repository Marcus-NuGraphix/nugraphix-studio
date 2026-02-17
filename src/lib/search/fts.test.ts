import { describe, expect, it } from 'vitest'
import {
  buildTsQueryPrefix,
  extractSearchTerms,
  normalizeSearchQuery,
} from '@/lib/search/fts'

describe('search/fts helpers', () => {
  it('normalizes whitespace in query strings', () => {
    expect(normalizeSearchQuery('  operational   clarity   systems  ')).toBe(
      'operational clarity systems',
    )
  })

  it('extracts bounded, sanitized search terms', () => {
    expect(extractSearchTerms('A b c structured-systems growth')).toEqual([
      'structured',
      'systems',
      'growth',
    ])
  })

  it('builds prefix tsquery syntax for terms', () => {
    expect(buildTsQueryPrefix('Structured systems growth')).toBe(
      'structured:* & systems:* & growth:*',
    )
  })
})
