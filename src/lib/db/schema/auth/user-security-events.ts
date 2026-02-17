import { sql } from 'drizzle-orm'
import { index, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { userSecurityEventType } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'
import { user } from './auth'

export const userSecurityEvent = pgTable(
  'user_security_event',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    type: userSecurityEventType('type').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    metadata: jsonb('metadata')
      .$type<Record<string, string | number | boolean | null>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('user_security_event_user_idx').on(table.userId),
    index('user_security_event_type_idx').on(table.type),
    index('user_security_event_created_at_idx').on(table.createdAt),
  ],
)


