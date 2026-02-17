import { sql } from 'drizzle-orm'
import { logger } from './logger'
import { db } from '@/lib/db'

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitLogger = logger.child({ domain: 'rate-limit' })

const memoryFallbackStore = new Map<string, RateLimitEntry>()

let schemaReadyPromise: Promise<void> | null = null

const ensureRateLimitSchema = async () => {
  if (schemaReadyPromise) {
    await schemaReadyPromise
    return
  }

  schemaReadyPromise = (async () => {
    await db.execute(
      sql.raw(`
      CREATE TABLE IF NOT EXISTS app_rate_limit_bucket (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        reset_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `),
    )

    await db.execute(
      sql.raw(`
      CREATE INDEX IF NOT EXISTS app_rate_limit_bucket_reset_at_idx
      ON app_rate_limit_bucket (reset_at);
    `),
    )
  })()

  try {
    await schemaReadyPromise
  } catch (error) {
    schemaReadyPromise = null
    throw error
  }
}

const checkRateLimitInMemory = ({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}) => {
  const now = Date.now()
  const existing = memoryFallbackStore.get(key)

  if (!existing || now > existing.resetAt) {
    memoryFallbackStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  }
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

export const checkRateLimit = async ({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}): Promise<RateLimitResult> => {
  try {
    await ensureRateLimitSchema()

    const resetAt = Date.now() + windowMs
    const result = await db.execute(sql`
      INSERT INTO app_rate_limit_bucket ("key", count, reset_at, updated_at)
      VALUES (${key}, 1, to_timestamp(${resetAt} / 1000.0), NOW())
      ON CONFLICT ("key")
      DO UPDATE
      SET
        count = CASE
          WHEN app_rate_limit_bucket.reset_at <= NOW() THEN 1
          WHEN app_rate_limit_bucket.count < ${limit} THEN app_rate_limit_bucket.count + 1
          ELSE app_rate_limit_bucket.count
        END,
        reset_at = CASE
          WHEN app_rate_limit_bucket.reset_at <= NOW() THEN to_timestamp(${resetAt} / 1000.0)
          ELSE app_rate_limit_bucket.reset_at
        END,
        updated_at = NOW()
      RETURNING
        count,
        (extract(epoch FROM reset_at) * 1000)::bigint AS reset_at_ms;
    `)

    const row = result.rows[0] as
      | { count?: number; reset_at_ms?: number | string | bigint }
      | undefined

    if (!row || typeof row.count !== 'number') {
      throw new Error('Rate limit query did not return a counter row')
    }

    const resetAtMs =
      typeof row.reset_at_ms === 'bigint'
        ? Number(row.reset_at_ms)
        : Number(row.reset_at_ms ?? resetAt)

    const allowed = row.count <= limit
    const remaining = allowed ? Math.max(0, limit - row.count) : 0

    return {
      allowed,
      remaining,
      resetAt: Number.isFinite(resetAtMs) ? resetAtMs : resetAt,
    }
  } catch (error) {
    rateLimitLogger.warn('rate-limit.database.fallback-memory', {
      key,
      limit,
      windowMs,
      error,
    })

    return checkRateLimitInMemory({ key, limit, windowMs })
  }
}
