import { timestamp } from 'drizzle-orm/pg-core'

const UTC_TIMESTAMP_CONFIG = {
  mode: 'date',
  withTimezone: true,
} as const

export const timestampUtc = (name: string) =>
  timestamp(name, UTC_TIMESTAMP_CONFIG)
