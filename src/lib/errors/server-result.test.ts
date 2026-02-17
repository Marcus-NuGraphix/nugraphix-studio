import { describe, expect, it } from 'vitest'
import { AppError } from '@/lib/errors/app-error'
import {
  fail,
  isServerFail,
  isServerOk,
  isServerResult,
  ok,
} from '@/lib/errors/server-result'

describe('server-result helpers', () => {
  it('creates success payloads with ok()', () => {
    const result = ok({ id: '123' })
    expect(result.ok).toBe(true)
    expect(result.data.id).toBe('123')
    expect(isServerOk(result)).toBe(true)
  })

  it('creates fail payloads with fail()', () => {
    const result = fail('FORBIDDEN', 'Forbidden action.')
    expect(result.ok).toBe(false)
    expect(result.error.code).toBe('FORBIDDEN')
    expect(isServerFail(result)).toBe(true)
  })

  it('detects server result shape', () => {
    expect(isServerResult(ok({}))).toBe(true)
    expect(isServerResult(fail('INTERNAL', 'Oops'))).toBe(true)
    expect(isServerResult({})).toBe(false)
    expect(isServerResult(null)).toBe(false)
  })
})

describe('AppError', () => {
  it('preserves metadata and cause', () => {
    const cause = new Error('root-cause')
    const error = new AppError('CONFLICT', 'Conflict.', {
      cause,
      fieldErrors: { email: ['Already exists.'] },
    })

    expect(error.name).toBe('AppError')
    expect(error.code).toBe('CONFLICT')
    expect(error.fieldErrors?.email).toEqual(['Already exists.'])
    expect(error.cause).toBe(cause)
  })
})
