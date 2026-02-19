import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { AppError } from '@/lib/errors/app-error'
import { toServerFail } from '@/lib/errors/to-server-fail'

describe('toServerFail', () => {
  it('maps zod errors to VALIDATION_ERROR with field errors', () => {
    const schema = z.object({
      email: z.string().email(),
    })
    const result = schema.safeParse({ email: 'invalid' })

    if (result.success) {
      throw new Error('Expected validation to fail in test setup.')
    }

    const fail = toServerFail(result.error)

    expect(fail.ok).toBe(false)
    expect(fail.error.code).toBe('VALIDATION_ERROR')
    const fieldErrors = fail.error.fieldErrors
    if (!fieldErrors) {
      throw new Error('Expected field errors for validation failure.')
    }
    expect(fieldErrors.email).toBeDefined()
  })

  it('passes through app errors', () => {
    const fail = toServerFail(
      new AppError('CONFLICT', 'User already exists.', {
        fieldErrors: { email: ['Already exists.'] },
      }),
    )

    expect(fail.error.code).toBe('CONFLICT')
    expect(fail.error.message).toBe('User already exists.')
    expect(fail.error.fieldErrors?.email).toEqual(['Already exists.'])
  })

  it('maps known auth-style messages', () => {
    const fail = toServerFail(new Error('User is not authenticated'))
    expect(fail.error.code).toBe('UNAUTHORIZED')
  })

  it('falls back to internal for unknown errors', () => {
    const fail = toServerFail(new Error('Database socket exploded'))
    expect(fail.error.code).toBe('INTERNAL')
    expect(fail.error.message).toBe('Something went wrong')
  })

  it('accepts embedded server-fail shaped objects', () => {
    const fail = toServerFail({
      error: {
        code: 'FORBIDDEN',
        message: 'Insufficient role permissions.',
      },
    })

    expect(fail.error.code).toBe('FORBIDDEN')
    expect(fail.error.message).toBe('Insufficient role permissions.')
  })
})
