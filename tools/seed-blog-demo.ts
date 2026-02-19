import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadDotEnv } from 'dotenv'
import { eq } from 'drizzle-orm'
import {
  estimateReadingTimeMinutes,
  toBlogContentText,
  toBlogDocString,
  toExcerpt,
} from '@/features/blog/model/content'
import type { BlogDocJSON } from '@/features/blog/model/types'

loadDotEnv({ path: resolve(process.cwd(), '.env.local') })
loadDotEnv({ path: resolve(process.cwd(), '.env') })

type BlogDocNode = NonNullable<BlogDocJSON['content']>[number]

interface SeedPostDefinition {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  publishedAt: string
  featured?: boolean
  isBreaking?: boolean
  metaTitle?: string
  metaDescription?: string
  contentJson: BlogDocJSON
}

const DEMO_AUTHOR = {
  id: 'blog-demo-editor',
  name: 'Nu Graphix Editorial',
  email: 'editorial@nugraphix.co.za',
}

const paragraph = (text: string) => ({
  type: 'paragraph',
  content: [{ type: 'text', text }],
})

const heading = (level: number, text: string) => ({
  type: 'heading',
  attrs: { level },
  content: [{ type: 'text', text }],
})

const quote = (text: string) => ({
  type: 'blockquote',
  content: [paragraph(text)],
})

const bulletList = (...items: Array<string>) => ({
  type: 'bulletList',
  content: items.map((item) => ({
    type: 'listItem',
    content: [paragraph(item)],
  })),
})

const orderedList = (...items: Array<string>) => ({
  type: 'orderedList',
  content: items.map((item) => ({
    type: 'listItem',
    content: [paragraph(item)],
  })),
})

const image = (src: string, alt: string, title: string) => ({
  type: 'image',
  attrs: { src, alt, title },
})

const codeBlock = (language: string, code: string) => ({
  type: 'codeBlock',
  attrs: { language },
  content: [{ type: 'text', text: code }],
})

const divider = () => ({ type: 'horizontalRule' })

const doc = (...content: Array<BlogDocNode>): BlogDocJSON => ({
  type: 'doc',
  content,
})

const seedPosts: Array<SeedPostDefinition> = [
  {
    id: 'demo-db-slow-publishing',
    title: 'Slow Publishing: An Editorial Workflow That Scales',
    slug: 'slow-publishing-editorial-workflow',
    excerpt:
      'A practical writing cadence for Nu Graphix teams shipping clearer technical stories without editorial churn.',
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80',
    featured: true,
    publishedAt: '2026-02-10T08:00:00.000Z',
    contentJson: doc(
      paragraph(
        'Nu Graphix treats each post as working documentation for clients and internal delivery teams.',
      ),
      heading(2, 'Workflow scaffold'),
      orderedList(
        'Define a single reader profile and decision outcome.',
        'Draft structure before language polish.',
        'Ship only after evidence and references are linked.',
      ),
      quote('Clarity compounds when process stays consistent.'),
      image(
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
        'Planning board for editorial workflow',
        'Editorial workflow board',
      ),
      divider(),
      heading(2, 'Publishing quality gate'),
      bulletList(
        'Check all operational claims against ADR decisions.',
        'Verify metrics and dates before publication.',
        'Capture one process improvement per article.',
      ),
    ),
  },
  {
    id: 'demo-db-ops-cadence',
    title: 'Editorial Operations Cadence for Product Teams',
    slug: 'editorial-operations-cadence-for-product-teams',
    excerpt:
      'How we align content publishing with architecture milestones, incidents, and release communications.',
    coverImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-01-30T09:00:00.000Z',
    contentJson: doc(
      paragraph(
        'Publishing should move in lockstep with delivery milestones, incident reviews, and release windows.',
      ),
      heading(2, 'Cadence'),
      bulletList(
        'Monday: architecture deltas and priority themes.',
        'Wednesday: first draft and reviewer pass.',
        'Friday: final quality gate, publish, and retrospective notes.',
      ),
      codeBlock(
        'ts',
        "const cadence = ['research', 'draft', 'review', 'publish']",
      ),
    ),
  },
  {
    id: 'demo-db-readability',
    title: 'Readability Governance for Technical Marketing',
    slug: 'readability-governance-technical-marketing',
    excerpt:
      'A governance baseline for keeping long-form technical writing clear, trustworthy, and conversion-aware.',
    coverImage:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-01-18T08:30:00.000Z',
    contentJson: doc(
      paragraph(
        'Readable technical writing is governed, not improvised. The goal is confidence without ambiguity.',
      ),
      heading(2, 'Governance checklist'),
      orderedList(
        'Define audience and expected action.',
        'Reference concrete implementation details.',
        'Remove unsupported claims and vague language.',
      ),
      quote(
        'Strong editorial governance protects both conversion and trust.',
      ),
    ),
  },
  {
    id: 'demo-db-incident-writing',
    title: 'Incident-Driven Publishing: Turning Failures into Playbooks',
    slug: 'incident-driven-publishing-playbook',
    excerpt:
      'How Nu Graphix converts production incidents into practical, reusable editorial content for teams and clients.',
    coverImage:
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=80',
    featured: true,
    publishedAt: '2026-02-16T06:30:00.000Z',
    contentJson: doc(
      paragraph(
        'Every incident offers learning value if captured with discipline and context.',
      ),
      heading(2, 'From incident to article'),
      orderedList(
        'Capture timeline and impact in plain language.',
        'Map root cause to architecture decisions.',
        'Publish remediation patterns with implementation references.',
      ),
      image(
        'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1600&q=80',
        'Monitoring dashboard during an incident',
        'Incident monitoring dashboard',
      ),
      codeBlock(
        'sql',
        "select count(*) from incident_events where severity in ('S1','S2');",
      ),
    ),
  },
  {
    id: 'demo-db-editor-governance',
    title: 'Structured Content Governance for Admin Teams',
    slug: 'structured-content-governance-admin-teams',
    excerpt:
      'An operating model for keeping editors, reviewers, and release owners aligned on publishing quality.',
    coverImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-02-12T07:45:00.000Z',
    contentJson: doc(
      heading(2, 'Roles and ownership'),
      bulletList(
        'Editor: owns narrative structure.',
        'Reviewer: validates technical accuracy.',
        'Release owner: validates business alignment and CTA.',
      ),
      divider(),
      heading(2, 'Definition of done'),
      paragraph(
        'A post is complete when it is technically correct, commercially relevant, and operationally traceable.',
      ),
      quote('Governance improves speed by removing ambiguity.'),
    ),
  },
  {
    id: 'demo-db-brief-to-release',
    title: 'From Brief to Release Notes in One Editorial Loop',
    slug: 'brief-to-release-notes-editorial-loop',
    excerpt:
      'A repeatable model for turning planning docs into customer-facing communication without duplicated effort.',
    coverImage:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-02-08T11:00:00.000Z',
    contentJson: doc(
      paragraph(
        'The same source material should serve internal planning and external communication with minimal duplication.',
      ),
      heading(2, 'Pipeline'),
      orderedList(
        'Brief: problem, scope, and expected outcomes.',
        'Implementation: architecture and delivery details.',
        'Release notes: concise value narrative for stakeholders.',
      ),
      codeBlock(
        'md',
        '## Release Outcome\n- Reliability improved\n- Admin workflow simplified',
      ),
    ),
  },
  {
    id: 'demo-db-admin-workflows',
    title: 'Admin Workflow Patterns for Content Operations',
    slug: 'admin-workflow-patterns-content-operations',
    excerpt:
      'How to structure admin dashboards, approvals, and audit trails for dependable editorial throughput.',
    coverImage:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80',
    featured: true,
    publishedAt: '2026-02-05T14:20:00.000Z',
    contentJson: doc(
      paragraph(
        'Content operations scale when admin workflow states are explicit and observable.',
      ),
      heading(2, 'Core states'),
      bulletList(
        'Draft: authoring and internal review.',
        'Ready: checks complete and awaiting publish trigger.',
        'Published: distributed and monitored for feedback.',
      ),
      image(
        'https://images.unsplash.com/photo-1573164713347-df1f09b8f3bb?auto=format&fit=crop&w=1600&q=80',
        'Team reviewing workflow states',
        'Editorial workflow review',
      ),
    ),
  },
  {
    id: 'demo-db-architecture-articles',
    title: 'Designing Readable Architecture Articles for Decision Makers',
    slug: 'designing-readable-architecture-articles',
    excerpt:
      'A practical structure for writing architecture articles that technical and non-technical stakeholders can both use.',
    coverImage:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    publishedAt: '2026-01-24T10:10:00.000Z',
    contentJson: doc(
      heading(2, 'Section model'),
      orderedList(
        'Business context and objective',
        'Technical approach and tradeoffs',
        'Risk controls and operational outcomes',
      ),
      paragraph(
        'This format lets leadership and engineering teams align quickly without losing implementation detail.',
      ),
      quote(
        'Readable architecture writing is a leadership tool, not a documentation afterthought.',
      ),
    ),
  },
]

const ensureDemoAuthor = async (dbClient: Awaited<ReturnType<typeof importDb>>) => {
  const { user } = await import('@/lib/db/schema')

  const existing = await dbClient.query.user.findFirst({
    where: eq(user.email, DEMO_AUTHOR.email),
  })

  if (existing) {
    return existing.id
  }

  await dbClient.insert(user).values({
    id: DEMO_AUTHOR.id,
    name: DEMO_AUTHOR.name,
    email: DEMO_AUTHOR.email,
    emailVerified: true,
    role: 'admin',
    status: 'active',
  })

  return DEMO_AUTHOR.id
}

const importDb = async () => {
  const { db } = await import('@/lib/db')
  return db
}

const seedPostsToDatabase = async (
  dbClient: Awaited<ReturnType<typeof importDb>>,
  authorId: string,
) => {
  const { post } = await import('@/lib/db/schema')

  for (const seed of seedPosts) {
    const contentText = toBlogContentText(seed.contentJson)
    const excerpt = toExcerpt(contentText, seed.excerpt)
    const readingTimeMinutes = estimateReadingTimeMinutes(contentText)
    const publishedAt = new Date(seed.publishedAt)

    await dbClient
      .insert(post)
      .values({
        id: seed.id,
        title: seed.title,
        slug: seed.slug,
        content: toBlogDocString(seed.contentJson),
        excerpt,
        coverImage: seed.coverImage,
        metaTitle: seed.metaTitle ?? seed.title,
        metaDescription: seed.metaDescription ?? excerpt,
        canonicalUrl: `https://nugraphix.co.za/blog/${seed.slug}`,
        readingTimeMinutes,
        featured: seed.featured ?? false,
        isBreaking: seed.isBreaking ?? false,
        status: 'published',
        authorId,
        publishedAt,
      })
      .onConflictDoUpdate({
        target: post.slug,
        set: {
          title: seed.title,
          content: toBlogDocString(seed.contentJson),
          excerpt,
          coverImage: seed.coverImage,
          metaTitle: seed.metaTitle ?? seed.title,
          metaDescription: seed.metaDescription ?? excerpt,
          canonicalUrl: `https://nugraphix.co.za/blog/${seed.slug}`,
          readingTimeMinutes,
          featured: seed.featured ?? false,
          isBreaking: seed.isBreaking ?? false,
          status: 'published',
          authorId,
          publishedAt,
          updatedAt: new Date(),
        },
      })
  }
}

export const seedBlogDemo = async () => {
  const dbClient = await importDb()
  const authorId = await ensureDemoAuthor(dbClient)
  await seedPostsToDatabase(dbClient, authorId)

  console.log(
    `[seed-blog-demo] Upserted ${seedPosts.length} published demo posts with author ${authorId}.`,
  )
}

const isDirectInvocation = () => {
  const entryPoint = process.argv[1]
  if (!entryPoint) {
    return false
  }

  return resolve(entryPoint) === fileURLToPath(import.meta.url)
}

if (isDirectInvocation()) {
  seedBlogDemo().catch((error) => {
    console.error('[seed-blog-demo] Failed to seed demo blog posts.')
    console.error(error)
    process.exitCode = 1
  })
}
