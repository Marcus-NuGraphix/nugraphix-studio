import { ZodError } from 'zod'
import { AppError } from './AppError'
import { fail } from './serverResult'
import type { ServerFail } from './serverResult'

export function toServerFail(error: unknown): ServerFail {
  if (error instanceof ZodError) {
    const fieldErrors = error.flatten().fieldErrors as Record<
      string,
      Array<string>
    >
    return fail('VALIDATION_ERROR', 'Validation failed', fieldErrors)
  }

  if (error instanceof AppError) {
    return fail(error.code, error.message, error.fieldErrors)
  }

  return fail('INTERNAL', 'Something went wrong')
}
