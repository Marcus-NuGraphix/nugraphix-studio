import { afterEach, describe, expect, it, vi } from 'vitest'
import { logger } from '@/lib/observability/logger'
import { logMutationResult } from '@/lib/observability/mutation-log'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('observability logger', () => {
  it('redacts common sensitive fields', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    logger.info('test.event', {
      apiKey: 'secret-value',
      nested: { token: 'secret-token' },
      headers: {
        authorization: 'Bearer very-secret-token',
        cookie: 'session=abc123',
      },
      safe: 'value',
    })

    expect(logSpy).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(String(logSpy.mock.calls[0][0])) as Record<
      string,
      unknown
    >

    expect(payload.apiKey).toBe('[REDACTED]')
    expect(payload.safe).toBe('value')

    const nested = payload.nested as Record<string, unknown>
    expect(nested.token).toBe('[REDACTED]')

    const headers = payload.headers as Record<string, unknown>
    expect(headers.authorization).toBe('[REDACTED]')
    expect(headers.cookie).toBe('[REDACTED]')
  })
})

describe('logMutationResult', () => {
  it('logs warning-level entries for failed mutations', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const mutationLogger = logger.child({ domain: 'test' })

    logMutationResult(mutationLogger, {
      feature: 'contact',
      action: 'submit',
      result: 'fail',
      errorCode: 'RATE_LIMITED',
      executionTimeMs: 128,
      userId: null,
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(String(warnSpy.mock.calls[0][0])) as Record<
      string,
      unknown
    >

    expect(payload.event).toBe('mutation.result')
    expect(payload.feature).toBe('contact')
    expect(payload.result).toBe('fail')
    expect(payload.errorCode).toBe('RATE_LIMITED')
  })
})
