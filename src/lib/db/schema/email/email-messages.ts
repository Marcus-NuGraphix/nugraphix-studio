import { sql } from 'drizzle-orm'
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
} from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import {
  emailMessageStatus,
  emailMessageType,
  emailProvider,
  emailTopic,
} from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'

export const emailMessage = pgTable(
  'email_message',
  {
    id: text('id').primaryKey(),
    toEmail: text('to_email').notNull(),
    toUserId: text('to_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    provider: emailProvider('provider').default('noop').notNull(),
    templateKey: text('template_key').notNull(),
    messageType: emailMessageType('message_type').default('system').notNull(),
    topic: emailTopic('topic'),
    status: emailMessageStatus('status').default('queued').notNull(),
    subject: text('subject').notNull(),
    fromEmail: text('from_email').notNull(),
    replyTo: text('reply_to'),
    html: text('html').notNull(),
    textBody: text('text_body').notNull(),
    providerMessageId: text('provider_message_id'),
    correlationKey: text('correlation_key'),
    idempotencyKey: text('idempotency_key').unique(),
    errorMessage: text('error_message'),
    attempts: integer('attempts').default(0).notNull(),
    scheduledAt: timestampUtc('scheduled_at'),
    sentAt: timestampUtc('sent_at'),
    payload: jsonb('payload')
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, string | number | boolean | null>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      'email_message_attempts_non_negative_chk',
      sql`${table.attempts} >= 0`,
    ),
    index('email_message_to_email_idx').on(table.toEmail),
    index('email_message_to_user_idx').on(table.toUserId),
    index('email_message_status_idx').on(table.status),
    index('email_message_topic_idx').on(table.topic),
    index('email_message_provider_message_id_idx').on(table.providerMessageId),
    index('email_message_created_at_idx').on(table.createdAt),
  ],
)



