import { index, integer, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import { contentStatus } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'

export const contentEntry = pgTable(
  'content_entry',
  {
    id: text('id').primaryKey(),
    domain: text('domain').notNull(),
    slug: text('slug'),
    routePath: text('route_path').notNull().unique(),
    templateKey: text('template_key').notNull(),
    status: contentStatus('status').default('draft').notNull(),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    canonicalUrl: text('canonical_url'),
    ogTitle: text('og_title'),
    ogDescription: text('og_description'),
    ogImage: text('og_image'),
    twitterTitle: text('twitter_title'),
    twitterDescription: text('twitter_description'),
    twitterImage: text('twitter_image'),
    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    updatedBy: text('updated_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('content_entry_domain_slug_unique').on(table.domain, table.slug),
    index('content_entry_domain_idx').on(table.domain),
    index('content_entry_template_key_idx').on(table.templateKey),
    index('content_entry_status_idx').on(table.status),
    index('content_entry_updated_at_idx').on(table.updatedAt),
  ],
)

export const contentRevision = pgTable(
  'content_revision',
  {
    id: text('id').primaryKey(),
    entryId: text('entry_id')
      .notNull()
      .references(() => contentEntry.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    payload: jsonb('payload').$type<Record<string, {}>>().notNull(),
    changeSummary: text('change_summary'),
    changedBy: text('changed_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('content_revision_entry_version_unique').on(
      table.entryId,
      table.version,
    ),
    index('content_revision_entry_id_idx').on(table.entryId),
    index('content_revision_created_at_idx').on(table.createdAt),
  ],
)

export const contentPublication = pgTable(
  'content_publication',
  {
    entryId: text('entry_id')
      .primaryKey()
      .references(() => contentEntry.id, { onDelete: 'cascade' }),
    publishedRevisionId: text('published_revision_id').references(
      () => contentRevision.id,
      {
        onDelete: 'set null',
      },
    ),
    publishedAt: timestampUtc('published_at'),
    scheduledAt: timestampUtc('scheduled_at'),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('content_publication_published_at_idx').on(table.publishedAt),
    index('content_publication_scheduled_at_idx').on(table.scheduledAt),
  ],
)



