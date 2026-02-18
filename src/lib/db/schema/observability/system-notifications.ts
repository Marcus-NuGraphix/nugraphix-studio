import { index, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { systemNotificationType } from '@/lib/db/schema/shared/enums'
import { timestampUtc } from '@/lib/db/schema/shared/timestamps'

export const systemNotification = pgTable(
  'system_notification',
  {
    id: text('id').primaryKey(),
    type: systemNotificationType('type').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    description: text('description'),
    source: text('source').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, string | number | boolean | null>>()
      .notNull(),
    readAt: timestampUtc('read_at'),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('system_notification_type_idx').on(table.type),
    index('system_notification_source_idx').on(table.source),
    index('system_notification_read_at_idx').on(table.readAt),
    index('system_notification_created_at_idx').on(table.createdAt),
  ],
)
