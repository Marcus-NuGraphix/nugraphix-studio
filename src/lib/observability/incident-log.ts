import type { Logger } from '@/lib/observability/logger'

export const incidentSeverityValues = ['S1', 'S2', 'S3'] as const
export type IncidentSeverity = (typeof incidentSeverityValues)[number]

export const incidentStatusValues = [
  'detected',
  'investigating',
  'mitigated',
  'resolved',
] as const
export type IncidentStatus = (typeof incidentStatusValues)[number]

type IncidentLogLevel = 'info' | 'warn' | 'error'

interface IncidentLogEntry {
  incidentKey: string
  domain: string
  category: string
  action: string
  severity: IncidentSeverity
  status: IncidentStatus
  userId?: string | null
  errorCode?: string
  failureCount?: number
  threshold?: number
  executionTimeMs?: number
}

const resolveIncidentLogLevel = (
  severity: IncidentSeverity,
  status: IncidentStatus,
): IncidentLogLevel => {
  if (status === 'resolved' || status === 'mitigated') {
    return 'info'
  }

  if (severity === 'S1') {
    return 'error'
  }

  if (severity === 'S2') {
    return 'warn'
  }

  return 'info'
}

export const logIncidentEvent = (
  log: Logger,
  entry: IncidentLogEntry,
  context?: Record<string, unknown>,
) => {
  const level = resolveIncidentLogLevel(entry.severity, entry.status)

  log[level]('incident.event', {
    incidentKey: entry.incidentKey,
    domain: entry.domain,
    category: entry.category,
    action: entry.action,
    severity: entry.severity,
    status: entry.status,
    userId: entry.userId ?? null,
    errorCode: entry.errorCode ?? null,
    failureCount: entry.failureCount ?? null,
    threshold: entry.threshold ?? null,
    executionTimeMs: entry.executionTimeMs ?? null,
    ...context,
  })
}
