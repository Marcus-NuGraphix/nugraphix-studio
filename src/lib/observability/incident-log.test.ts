import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  logIncidentEvent,
  recordFailureForEscalation,
  resetFailureEscalationState,
  resolveFailureEscalation,
} from '@/lib/observability'
import { logger } from '@/lib/observability/logger'

afterEach(() => {
  vi.restoreAllMocks()
  resetFailureEscalationState()
})

describe('logIncidentEvent', () => {
  it('emits S2 incidents as structured warning events', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const scopedLogger = logger.child({ domain: 'incident-test' })

    logIncidentEvent(scopedLogger, {
      incidentKey: 'blog.publish-flow',
      domain: 'blog',
      category: 'publish-flow',
      action: 'publish-post',
      severity: 'S2',
      status: 'detected',
      userId: 'user_1',
      errorCode: 'INTERNAL',
      failureCount: 1,
      threshold: 3,
      executionTimeMs: 42,
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(String(warnSpy.mock.calls[0][0])) as Record<
      string,
      unknown
    >

    expect(payload.event).toBe('incident.event')
    expect(payload.severity).toBe('S2')
    expect(payload.status).toBe('detected')
    expect(payload.category).toBe('publish-flow')
    expect(payload.failureCount).toBe(1)
    expect(payload.threshold).toBe(3)
  })
})

describe('three-failure escalation', () => {
  it('escalates on the third failure and resolves after recovery', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const infoSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const scopedLogger = logger.child({ domain: 'incident-test' })

    const first = recordFailureForEscalation(scopedLogger, {
      incidentKey: 'blog.publish-flow',
      domain: 'blog',
      category: 'publish-flow',
      action: 'publish-post',
      severity: 'S2',
      threshold: 3,
    })

    const second = recordFailureForEscalation(scopedLogger, {
      incidentKey: 'blog.publish-flow',
      domain: 'blog',
      category: 'publish-flow',
      action: 'publish-post',
      severity: 'S2',
      threshold: 3,
    })

    const third = recordFailureForEscalation(scopedLogger, {
      incidentKey: 'blog.publish-flow',
      domain: 'blog',
      category: 'publish-flow',
      action: 'publish-post',
      severity: 'S2',
      threshold: 3,
    })

    expect(first.escalated).toBe(false)
    expect(second.escalated).toBe(false)
    expect(third.escalated).toBe(true)
    expect(third.failureCount).toBe(3)

    const warnPayloads = warnSpy.mock.calls.map((call) =>
      JSON.parse(String(call[0])) as Record<string, unknown>,
    )

    const escalationPayload = warnPayloads.find(
      (payload) => payload.status === 'investigating',
    )

    expect(escalationPayload).toBeDefined()
    expect(escalationPayload?.escalationRule).toBe('three-failure-rule')

    resolveFailureEscalation(scopedLogger, {
      incidentKey: 'blog.publish-flow',
      domain: 'blog',
      category: 'publish-flow',
      action: 'publish-post',
      severity: 'S2',
      threshold: 3,
    })

    const infoPayloads = infoSpy.mock.calls.map((call) =>
      JSON.parse(String(call[0])) as Record<string, unknown>,
    )

    const resolvedPayload = infoPayloads.find(
      (payload) => payload.status === 'resolved',
    )

    expect(resolvedPayload).toBeDefined()
    expect(resolvedPayload?.failureCount).toBe(3)
  })
})

