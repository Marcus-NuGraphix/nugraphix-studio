import { boolean, index, pgTable, text } from 'drizzle-orm/pg-core'
import { timestampUtc } from '../shared/timestamps'

export const postTag = pgTable(
  'post_tag',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('post_tag_slug_idx').on(table.slug),
    index('post_tag_visible_idx').on(table.isVisible),
  ],
)

