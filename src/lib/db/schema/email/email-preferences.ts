import { boolean, index, pgTable, text } from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import { timestampUtc } from '../shared/timestamps'

export const emailPreference = pgTable(
  'email_preference',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    transactionalEnabled: boolean('transactional_enabled')
      .default(true)
      .notNull(),
    editorialEnabled: boolean('editorial_enabled').default(true).notNull(),
    blogUpdatesEnabled: boolean('blog_updates_enabled').default(true).notNull(),
    pressUpdatesEnabled: boolean('press_updates_enabled')
      .default(true)
      .notNull(),
    productUpdatesEnabled: boolean('product_updates_enabled')
      .default(false)
      .notNull(),
    securityAlertsEnabled: boolean('security_alerts_enabled')
      .default(true)
      .notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('email_preference_updated_at_idx').on(table.updatedAt)],
)


