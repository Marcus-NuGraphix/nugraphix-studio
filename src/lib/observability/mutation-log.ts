import type { Logger } from '@/lib/observability/logger'

type MutationLogResult = 'ok' | 'fail'

interface MutationLogEntry {
  feature: string
  action: string
  result: MutationLogResult
  userId?: string | null
  errorCode?: string
  executionTimeMs: number
}

export const logMutationResult = (
  log: Logger,
  entry: MutationLogEntry,
  context?: Record<string, unknown>,
) => {
  const level = entry.result === 'ok' ? 'info' : 'warn'
  log[level]('mutation.result', {
    feature: entry.feature,
    action: entry.action,
    userId: entry.userId ?? null,
    result: entry.result,
    errorCode: entry.errorCode ?? null,
    executionTimeMs: entry.executionTimeMs,
    ...context,
  })
}
