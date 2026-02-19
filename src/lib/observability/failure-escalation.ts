import type { Logger } from '@/lib/observability/logger'
import type { IncidentSeverity } from '@/lib/observability/incident-log'
import { logIncidentEvent } from '@/lib/observability/incident-log'

const DEFAULT_FAILURE_ESCALATION_THRESHOLD = 3

const failureCountsByIncidentKey = new Map<string, number>()

interface FailureEscalationEntry {
  incidentKey: string
  domain: string
  category: string
  action: string
  severity: IncidentSeverity
  userId?: string | null
  errorCode?: string
  executionTimeMs?: number
  threshold?: number
}

interface FailureEscalationResult {
  failureCount: number
  threshold: number
  escalated: boolean
}

export const recordFailureForEscalation = (
  log: Logger,
  entry: FailureEscalationEntry,
  context?: Record<string, unknown>,
): FailureEscalationResult => {
  const threshold = entry.threshold ?? DEFAULT_FAILURE_ESCALATION_THRESHOLD
  const nextFailureCount = (failureCountsByIncidentKey.get(entry.incidentKey) ?? 0) + 1

  failureCountsByIncidentKey.set(entry.incidentKey, nextFailureCount)

  logIncidentEvent(
    log,
    {
      ...entry,
      status: 'detected',
      failureCount: nextFailureCount,
      threshold,
    },
    context,
  )

  const escalated = nextFailureCount >= threshold
  if (escalated) {
    logIncidentEvent(
      log,
      {
        ...entry,
        status: 'investigating',
        failureCount: nextFailureCount,
        threshold,
      },
      {
        escalationRule: 'three-failure-rule',
        ...context,
      },
    )
  }

  return {
    failureCount: nextFailureCount,
    threshold,
    escalated,
  }
}

export const resolveFailureEscalation = (
  log: Logger,
  entry: Omit<FailureEscalationEntry, 'errorCode' | 'executionTimeMs'>,
  context?: Record<string, unknown>,
) => {
  const failureCount = failureCountsByIncidentKey.get(entry.incidentKey)
  if (!failureCount) {
    return
  }

  failureCountsByIncidentKey.delete(entry.incidentKey)

  logIncidentEvent(
    log,
    {
      ...entry,
      status: 'resolved',
      failureCount,
      threshold: entry.threshold ?? DEFAULT_FAILURE_ESCALATION_THRESHOLD,
    },
    context,
  )
}

export const resetFailureEscalationState = () => {
  failureCountsByIncidentKey.clear()
}
