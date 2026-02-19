import { relations } from 'drizzle-orm'
import { index, pgTable, text } from 'drizzle-orm/pg-core'
import { user } from '../auth/auth'
import { contactSubmissionStatus } from './enums'
import { timestampUtc } from './timestamps'

export const contactSubmission = pgTable(
  'contact_submission',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    suburb: text('suburb').notNull(),
    serviceInterest: text('service_interest').notNull(),
    propertyType: text('property_type').notNull(),
    urgency: text('urgency').notNull(),
    preferredContactMethod: text('preferred_contact_method').notNull(),
    bestContactTime: text('best_contact_time'),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    sourcePath: text('source_path').notNull(),
    status: contactSubmissionStatus('status').default('new').notNull(),
    notes: text('notes'),
    assignedTo: text('assigned_to').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('contact_submission_email_idx').on(table.email),
    index('contact_submission_status_idx').on(table.status),
    index('contact_submission_assigned_to_idx').on(table.assignedTo),
    index('contact_submission_created_at_idx').on(table.createdAt),
    index('contact_submission_service_interest_idx').on(table.serviceInterest),
    index('contact_submission_urgency_idx').on(table.urgency),
  ],
)

export const contactSubmissionRelations = relations(
  contactSubmission,
  ({ one }) => ({
    assignee: one(user, {
      fields: [contactSubmission.assignedTo],
      references: [user.id],
    }),
  }),
)
