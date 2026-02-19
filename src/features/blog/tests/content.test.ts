import { describe, expect, it } from 'vitest'
import {
  emptyBlogDoc,
  estimateReadingTimeMinutes,
  parseBlogDoc,
  toBlogContentText,
  toExcerpt,
} from '@/features/blog/model/content'

describe('blog content utilities', () => {
  it('returns empty doc for invalid json', () => {
    const result = parseBlogDoc('not-json')
    expect(result).toEqual(emptyBlogDoc())
  })

  it('extracts plain text from prosekit document json', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Nu Graphix' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Studio engineering blog' }],
        },
      ],
    }

    expect(toBlogContentText(doc)).toBe('Nu Graphix Studio engineering blog')
  })

  it('computes excerpt and reading time from text', () => {
    const text = 'word '.repeat(450).trim()
    expect(estimateReadingTimeMinutes(text)).toBe(3)
    expect(toExcerpt('Hello world', '')).toBe('Hello world')
  })
})
