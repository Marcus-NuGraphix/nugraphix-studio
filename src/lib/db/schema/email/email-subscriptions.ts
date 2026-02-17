import { sql } from 'drizzle-orm'
import {
  check,
  index,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import { emailSubscriptionStatus, emailTopic } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'

export const emailSubscription = pgTable(
  'email_subscription',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    email: text('email').notNull(),
    topic: emailTopic('topic').notNull(),
    status: emailSubscriptionStatus('status').default('subscribed').notNull(),
    source: text('source').default('public').notNull(),
    unsubscribeToken: text('unsubscribe_token').notNull().unique(),
    metadata: jsonb('metadata')
      .$type<Record<string, string | number | boolean | null>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    unsubscribedAt: timestampUtc('unsubscribed_at'),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      'email_subscription_unsubscribed_state_chk',
      sql`${table.unsubscribedAt} IS NULL OR ${table.status} = 'unsubscribed'`,
    ),
    uniqueIndex('email_subscription_email_topic_unique').on(
      table.email,
      table.topic,
    ),
    index('email_subscription_user_idx').on(table.userId),
    index('email_subscription_status_idx').on(table.status),
    index('email_subscription_topic_idx').on(table.topic),
  ],
)



