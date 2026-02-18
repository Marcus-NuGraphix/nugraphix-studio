import { describe, expect, it } from 'vitest'
import { mediaAssetFiltersSchema } from '@/features/media/model/filters'

describe('mediaAssetFiltersSchema', () => {
  it('applies defaults for empty input', () => {
    const parsed = mediaAssetFiltersSchema.parse({})

    expect(parsed.sort).toBe('created-desc')
    expect(parsed.page).toBe(1)
    expect(parsed.pageSize).toBe(20)
  })

  it('accepts explicit filter payload', () => {
    const parsed = mediaAssetFiltersSchema.parse({
      query: '  hero image ',
      type: 'document',
      sort: 'size-desc',
      page: 2,
      pageSize: 10,
    })

    expect(parsed.query).toBe('hero image')
    expect(parsed.type).toBe('document')
    expect(parsed.sort).toBe('size-desc')
    expect(parsed.page).toBe(2)
    expect(parsed.pageSize).toBe(10)
  })

  it('rejects invalid page size bounds', () => {
    const parsed = mediaAssetFiltersSchema.safeParse({ pageSize: 101 })

    expect(parsed.success).toBe(false)
  })
})
