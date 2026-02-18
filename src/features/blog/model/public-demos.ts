import type { BlogPostDetail, BlogPublicPostListItem } from '@/features/blog/model/types'
import {
  estimateReadingTimeMinutes,
  toBlogContentText,
} from '@/features/blog/model/content'

interface DemoPostSeed {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  metaTitle?: string
  metaDescription?: string
  featured?: boolean
  isBreaking?: boolean
  publishedAt: string
  updatedAt?: string
  contentJson: BlogPostDetail['contentJson']
}

const DEMO_AUTHOR = {
  id: 'nu-graphix-editorial',
  name: 'Nu Graphix Editorial',
  email: 'editorial@nugraphix.co.za',
}

const toIsoDate = (value: string) => new Date(value)

const createDemoPost = (seed: DemoPostSeed): BlogPostDetail => {
  const contentText = toBlogContentText(seed.contentJson)
  const readingTimeMinutes = estimateReadingTimeMinutes(contentText)
  const publishedAt = toIsoDate(seed.publishedAt)
  const updatedAt = seed.updatedAt ? toIsoDate(seed.updatedAt) : publishedAt

  return {
    id: seed.id,
    title: seed.title,
    slug: seed.slug,
    status: 'published',
    contentJson: seed.contentJson,
    contentText,
    excerpt: seed.excerpt,
    coverImage: seed.coverImage,
    metaTitle: seed.metaTitle ?? seed.title,
    metaDescription: seed.metaDescription ?? seed.excerpt,
    canonicalUrl: `https://nugraphix.co.za/blog/${seed.slug}`,
    readingTimeMinutes,
    featured: seed.featured ?? false,
    isBreaking: seed.isBreaking ?? false,
    authorId: DEMO_AUTHOR.id,
    authorName: DEMO_AUTHOR.name,
    authorEmail: DEMO_AUTHOR.email,
    publishedAt,
    createdAt: publishedAt,
    updatedAt,
  }
}

const demoPublicBlogPostSeeds: Array<DemoPostSeed> = [
  {
    id: 'demo-slow-publishing',
    title: 'Slow Publishing: An Editorial Workflow That Scales',
    slug: 'slow-publishing-editorial-workflow',
    excerpt:
      'A practical writing cadence for Nu Graphix teams shipping clearer technical stories without editorial churn.',
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
    featured: true,
    publishedAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-14T07:30:00.000Z',
    contentJson: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Nu Graphix treats every article as working documentation. The objective is not volume; it is repeatable clarity.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '1) Start with a focused briefing block' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Before drafting, we define one audience, one operational problem, and one business decision the post should support.',
            },
          ],
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Slow is not indecision. It is deliberate sequencing.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '2) Draft in system layers' }],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Structure pass: headings, argument flow, and data gaps.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Message pass: value proposition, CTA, and stakeholder context.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Polish pass: tighten language, remove noise, validate terminology.' }],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '3) Run a Friday quality gate' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Read the opening paragraph aloud for comprehension and pace.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Confirm each section ties back to a measurable outcome.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Capture one process improvement in the team publishing playbook.' }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'demo-operations-cadence',
    title: 'Editorial Operations Cadence for Product Teams',
    slug: 'editorial-operations-cadence-for-product-teams',
    excerpt:
      'How we align content publishing with architecture milestones, incidents, and release communications.',
    coverImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-01-30T09:00:00.000Z',
    updatedAt: '2026-02-08T10:00:00.000Z',
    contentJson: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Content should move with delivery rhythm. At Nu Graphix, blog planning is anchored to roadmap and incident review windows.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Operational mapping model' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Monday: capture architecture decision deltas from the previous sprint.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Wednesday: draft explainers tied to upcoming release objectives.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Friday: publish with references to implementation evidence and follow-up actions.' }],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Avoid editorial drift' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Every article must be traceable to an ADR, a roadmap milestone, or a measurable service outcome. If it cannot be traced, it is backlogged.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'demo-readability-governance',
    title: 'Readability Governance for Technical Marketing',
    slug: 'readability-governance-technical-marketing',
    excerpt:
      'A governance baseline for keeping long-form technical writing clear, trustworthy, and conversion-aware.',
    coverImage:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-01-18T08:30:00.000Z',
    contentJson: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Readers reward precision. Readability governance ensures engineering depth remains accessible without diluting technical rigor.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Governance checklist' }],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Define primary reader role and expected decision outcome.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Use concrete metrics, dates, and implementation references.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Run a final pass for ambiguity, over-claiming, and unsupported assertions.' }],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This model helps teams publish confidently while protecting brand trust and delivery credibility.',
            },
          ],
        },
      ],
    },
  },
]

export const demoPublicBlogPosts = demoPublicBlogPostSeeds.map(createDemoPost)

export const demoPublicBlogPostListItems: Array<BlogPublicPostListItem> =
  demoPublicBlogPosts
    .map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      featured: post.featured,
      readingTimeMinutes: post.readingTimeMinutes,
      publishedAt: post.publishedAt ?? new Date(),
    }))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

export const findDemoPublicBlogPostBySlug = (
  slug: string,
): BlogPostDetail | null =>
  demoPublicBlogPosts.find((post) => post.slug === slug) ?? null
