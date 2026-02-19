import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
} from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import { postStatus } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'

export const post = pgTable(
  'post',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content').default('').notNull(),
    excerpt: text('excerpt'),
    coverImage: text('cover_image'),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    canonicalUrl: text('canonical_url'),
    readingTimeMinutes: integer('reading_time_minutes').default(1).notNull(),
    featured: boolean('featured').default(false).notNull(),
    isBreaking: boolean('is_breaking').default(false).notNull(),
    status: postStatus('status').default('draft').notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    publishedAt: timestampUtc('published_at'),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      'post_published_at_required_for_published_chk',
      sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`,
    ),
    index('post_slug_idx').on(table.slug),
    index('post_authorId_idx').on(table.authorId),
    index('post_status_idx').on(table.status),
    index('post_publishedAt_idx').on(table.publishedAt),
    index('post_updatedAt_idx').on(table.updatedAt),
    index('post_status_publishedAt_idx').on(table.status, table.publishedAt),
    index('post_featured_publishedAt_idx').on(
      table.featured,
      table.publishedAt,
    ),
  ],
)



