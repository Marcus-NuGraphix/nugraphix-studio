import { boolean, index, integer, pgTable, text } from 'drizzle-orm/pg-core'
import { timestampUtc } from '../shared/timestamps'

export const postCategory = pgTable(
  'post_category',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    parentCategoryId: text('parent_category_id'),
    isVisible: boolean('is_visible').default(true).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('post_category_slug_idx').on(table.slug),
    index('post_category_parent_idx').on(table.parentCategoryId),
    index('post_category_visible_sort_idx').on(
      table.isVisible,
      table.sortOrder,
    ),
  ],
)

