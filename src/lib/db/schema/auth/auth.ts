import { relations } from 'drizzle-orm'
import {
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  text,
} from 'drizzle-orm/pg-core'
import { userRole, userStatus } from '../shared/enums'
import { timestampUtc } from '../shared/timestamps'

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    role: userRole('role').default('user').notNull(),
    status: userStatus('status').default('active').notNull(),
    banned: boolean('banned'),
    banReason: text('ban_reason'),
    banExpires: timestampUtc('ban_expires'),
    suspendedAt: timestampUtc('suspended_at'),
    suspendedReason: text('suspended_reason'),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('user_role_idx').on(table.role),
    index('user_status_idx').on(table.status),
    index('user_created_at_idx').on(table.createdAt),
  ],
)

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestampUtc('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestampUtc('access_token_expires_at'),
    refreshTokenExpiresAt: timestampUtc('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestampUtc('expires_at').notNull(),
    createdAt: timestampUtc('created_at').defaultNow().notNull(),
    updatedAt: timestampUtc('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const rateLimit = pgTable(
  'rate_limit',
  {
    id: text('id').notNull().unique(),
    key: text('key').primaryKey(),
    count: integer('count').notNull(),
    lastRequest: bigint('last_request', { mode: 'number' }).notNull(),
  },
  (table) => [index('rate_limit_last_request_idx').on(table.lastRequest)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))


