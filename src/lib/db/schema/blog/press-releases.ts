import { relations, sql } from 'drizzle-orm'
import { check, index, pgTable, text } from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import { postStatus } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'

export const pressRelease = pgTable(
  'press_release',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    summary: text('summary'),
    coverImage: text('cover_image'),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    canonicalUrl: text('canonical_url'),
    socialImage: text('social_image'),
    pdfUrl: text('pdf_url'),
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
      'press_release_published_at_required_for_published_chk',
      sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`,
    ),
    index('press_release_slug_idx').on(table.slug),
    index('press_release_status_idx').on(table.status),
    index('press_release_publishedAt_idx').on(table.publishedAt),
    index('press_release_updatedAt_idx').on(table.updatedAt),
    index('press_release_status_publishedAt_idx').on(
      table.status,
      table.publishedAt,
    ),
    index('press_release_authorId_idx').on(table.authorId),
  ],
)

export const pressReleaseRelations = relations(pressRelease, ({ one }) => ({
  author: one(user, { fields: [pressRelease.authorId], references: [user.id] }),
}))



