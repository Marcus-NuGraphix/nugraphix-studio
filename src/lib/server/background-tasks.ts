import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { logger } from '@/lib/observability'

type BackgroundTaskName =
  | 'email.send'
  | 'webhook.dispatch'
  | 'search.reindex'
  | 'news.publish'
  | 'blog.publish'

interface BackgroundTask<TPayload = unknown> {
  name: BackgroundTaskName
  payload: TPayload
  runAt?: Date
}

type BackgroundTaskHandler = (payload: unknown) => Promise<void>

type ClaimedTaskRow = {
  id: string
  name: BackgroundTaskName
  payload: unknown
  attempts: number
}

const queueLogger = logger.child({ domain: 'background-tasks' })

const taskHandlers = new Map<BackgroundTaskName, BackgroundTaskHandler>()

const MAX_TASK_ATTEMPTS = 5
const RETRY_DELAY_MS = 30_000

let schemaReadyPromise: Promise<void> | null = null
let handlersReadyPromise: Promise<void> | null = null

const ensureBackgroundTaskSchema = async () => {
  if (schemaReadyPromise) {
    await schemaReadyPromise
    return
  }

  schemaReadyPromise = (async () => {
    await db.execute(
      sql.raw(`
      CREATE TABLE IF NOT EXISTS app_background_task (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        payload JSONB NOT NULL DEFAULT '{}'::jsonb,
        run_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL DEFAULT 'queued',
        attempts INTEGER NOT NULL DEFAULT 0,
        last_error TEXT,
        locked_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `),
    )

    await db.execute(
      sql.raw(`
      CREATE INDEX IF NOT EXISTS app_background_task_status_run_at_idx
      ON app_background_task (status, run_at);
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

const ensureBackgroundTaskHandlersRegistered = async () => {
  if (handlersReadyPromise) {
    await handlersReadyPromise
    return
  }

  handlersReadyPromise = Promise.all([
    import('@/features/email/server/send.server'),
  ]).then(() => undefined)

  try {
    await handlersReadyPromise
  } catch (error) {
    handlersReadyPromise = null
    throw error
  }
}

const claimNextDueTask = async (): Promise<ClaimedTaskRow | null> => {
  const result = await db.execute(sql`
    WITH next_task AS (
      SELECT id
      FROM app_background_task
      WHERE status = 'queued'
        AND run_at <= NOW()
      ORDER BY run_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE app_background_task
    SET
      status = 'processing',
      locked_at = NOW(),
      updated_at = NOW()
    WHERE id IN (SELECT id FROM next_task)
    RETURNING id, name, payload, attempts;
  `)

  const row = result.rows[0] as
    | {
        id?: string
        name?: string
        payload?: unknown
        attempts?: number
      }
    | undefined

  if (!row || !row.id || !row.name) return null

  return {
    id: row.id,
    name: row.name as BackgroundTaskName,
    payload: row.payload ?? {},
    attempts: typeof row.attempts === 'number' ? row.attempts : 0,
  }
}

const markTaskCompleted = async (taskId: string) => {
  await db.execute(sql`
    UPDATE app_background_task
    SET
      status = 'completed',
      last_error = NULL,
      locked_at = NULL,
      updated_at = NOW()
    WHERE id = ${taskId};
  `)
}

const markTaskFailed = async ({
  taskId,
  attempts,
  error,
}: {
  taskId: string
  attempts: number
  error: unknown
}) => {
  const attemptsAfterFailure = attempts + 1
  const terminal = attemptsAfterFailure >= MAX_TASK_ATTEMPTS
  const safeError =
    error instanceof Error ? error.message.slice(0, 500) : 'Unknown task error'

  await db.execute(sql`
    UPDATE app_background_task
    SET
      attempts = attempts + 1,
      status = ${terminal ? 'failed' : 'queued'},
      run_at = CASE
        WHEN ${terminal} THEN run_at
        ELSE NOW() + (${RETRY_DELAY_MS} / 1000.0) * INTERVAL '1 second'
      END,
      last_error = ${safeError},
      locked_at = NULL,
      updated_at = NOW()
    WHERE id = ${taskId};
  `)
}

export const registerBackgroundTaskHandler = (
  name: BackgroundTaskName,
  handler: BackgroundTaskHandler,
) => {
  taskHandlers.set(name, handler)
}

export const drainDueBackgroundTasks = async ({
  limit = 25,
}: {
  limit?: number
} = {}) => {
  await ensureBackgroundTaskSchema()
  await ensureBackgroundTaskHandlersRegistered()

  let processed = 0
  let failed = 0

  while (processed < limit) {
    const task = await claimNextDueTask()
    if (!task) break

    const handler = taskHandlers.get(task.name)

    if (!handler) {
      await markTaskFailed({
        taskId: task.id,
        attempts: task.attempts,
        error: new Error(
          `No background task handler registered for ${task.name}`,
        ),
      })
      failed += 1
      processed += 1
      continue
    }

    try {
      await handler(task.payload)
      await markTaskCompleted(task.id)
    } catch (error) {
      await markTaskFailed({
        taskId: task.id,
        attempts: task.attempts,
        error,
      })
      failed += 1

      queueLogger.error('background-task.execution.failed', {
        taskId: task.id,
        taskName: task.name,
        attempts: task.attempts + 1,
        error,
      })
    }

    processed += 1
  }

  return { processed, failed }
}

export interface BackgroundTaskClient {
  enqueue: <TPayload>(
    task: BackgroundTask<TPayload>,
  ) => Promise<{ queued: true }>
}

const createBackgroundTaskClient = (): BackgroundTaskClient => ({
  async enqueue<TPayload>(task: BackgroundTask<TPayload>) {
    await ensureBackgroundTaskSchema()

    const runAt = task.runAt ?? new Date()

    await db.execute(sql`
      INSERT INTO app_background_task (id, name, payload, run_at, status, attempts)
      VALUES (
        ${crypto.randomUUID()},
        ${task.name},
        ${JSON.stringify(task.payload ?? {})}::jsonb,
        ${runAt},
        'queued',
        0
      );
    `)

    // Opportunistic drain keeps immediate tasks low-latency while still
    // persisting all jobs for durable retries and delayed processing.
    if (runAt.getTime() <= Date.now()) {
      await drainDueBackgroundTasks({ limit: 10 })
    }

    return { queued: true as const }
  },
})

export const backgroundTasks = createBackgroundTaskClient()
