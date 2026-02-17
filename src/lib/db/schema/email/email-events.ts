import { sql } from 'drizzle-orm'
import { index, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { emailEventType } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'
import { emailMessage } from './email-messages'

export const emailEvent = pgTable(
  'email_event',
  {
    id: text('id').primaryKey(),
    messageId: text('message_id').references(() => emailMessage.id, {
      onDelete: 'set null',
    }),
    type: emailEventType('type').notNull(),
    providerEventId: text('provider_event_id'),
    email: text('email'),
    occurredAt: timestampUtc('occurred_at'),
    payload: jsonb('payload')
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('email_event_message_idx').on(table.messageId),
    index('email_event_type_idx').on(table.type),
    index('email_event_created_at_idx').on(table.createdAt),
    uniqueIndex('email_event_provider_event_id_unique').on(
      table.providerEventId,
    ),
  ],
)


