import { sql } from 'drizzle-orm'
import { index, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { userAuditAction } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'
import { user } from './auth'

export const userAuditEvent = pgTable(
  'user_audit_event',
  {
    id: text('id').primaryKey(),
    action: userAuditAction('action').notNull(),
    actorUserId: text('actor_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    actorEmail: text('actor_email'),
    targetUserId: text('target_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    targetEmail: text('target_email').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, string | number | boolean | null>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('user_audit_event_action_idx').on(table.action),
    index('user_audit_event_actor_idx').on(table.actorUserId),
    index('user_audit_event_target_idx').on(table.targetUserId),
    index('user_audit_event_created_at_idx').on(table.createdAt),
  ],
)


