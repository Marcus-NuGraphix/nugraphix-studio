import { describe, expect, it } from 'vitest'
import {
  blogPostEditorSchema,
  createBlogPostSchema,
  updateBlogPostSchema,
} from '@/features/blog/schemas/posts'

describe('blog post schemas', () => {
  const basePayload = {
    title: 'Phase 03 Implementation Notes',
    slug: 'phase-03-implementation-notes',
    contentJson: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
    },
    excerpt: 'A short summary.',
    coverImage: 'https://cdn.example.com/image.jpg',
    metaTitle: 'Phase 03',
    metaDescription: 'MVP implementation update',
    canonicalUrl: 'https://nugraphix.co.za/blog/phase-03-implementation-notes',
    featured: true,
    isBreaking: false,
    status: 'draft' as const,
  }

  it('accepts valid create payload', () => {
    const parsed = createBlogPostSchema.parse(basePayload)
    expect(parsed.slug).toBe('phase-03-implementation-notes')
    expect(parsed.status).toBe('draft')
  })

  it('rejects invalid slug format', () => {
    const result = blogPostEditorSchema.safeParse({
      ...basePayload,
      slug: 'Invalid Slug',
    })

    expect(result.success).toBe(false)
  })

  it('requires id for update payload', () => {
    const result = updateBlogPostSchema.safeParse(basePayload)
    expect(result.success).toBe(false)

    const withId = updateBlogPostSchema.safeParse({
      ...basePayload,
      id: 'post_123',
    })
    expect(withId.success).toBe(true)
  })
})
