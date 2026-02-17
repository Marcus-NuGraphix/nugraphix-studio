import { ZodError } from 'zod'
import { AppError } from './app-error'
import { fail } from './server-result'
import type { ServerFail } from './server-result'

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
