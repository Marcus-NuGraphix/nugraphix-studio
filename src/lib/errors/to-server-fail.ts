import { ZodError, z } from 'zod'
import { AppError } from './app-error'
import { fail, serverErrorCodes } from './server-result'
import type { ServerErrorCode, ServerFail } from './server-result'

const messageIncludes = (value: string, needle: string) =>
  value.toLowerCase().includes(needle)

const mapMessageToCode = (message: string): ServerErrorCode => {
  if (
    messageIncludes(message, 'unauthorized') ||
    messageIncludes(message, 'not authenticated')
  ) {
    return 'UNAUTHORIZED'
  }

  if (
    messageIncludes(message, 'forbidden') ||
    messageIncludes(message, 'permission')
  ) {
    return 'FORBIDDEN'
  }

  if (messageIncludes(message, 'not found')) {
    return 'NOT_FOUND'
  }

  if (
    messageIncludes(message, 'conflict') ||
    messageIncludes(message, 'already exists')
  ) {
    return 'CONFLICT'
  }

  if (
    messageIncludes(message, 'rate limit') ||
    messageIncludes(message, 'too many')
  ) {
    return 'RATE_LIMITED'
  }

  return 'INTERNAL'
}

const isServerErrorCode = (value: unknown): value is ServerErrorCode =>
  typeof value === 'string' &&
  serverErrorCodes.includes(value as ServerErrorCode)

export function toServerFail(error: unknown): ServerFail {
  if (error instanceof ZodError) {
    const { fieldErrors, formErrors } = z.flattenError(error)
    const message = formErrors[0] ?? 'Validation failed'
    return fail('VALIDATION_ERROR', message, fieldErrors)
  }

  if (error instanceof AppError) {
    return fail(error.code, error.message, error.fieldErrors)
  }

  if (error && typeof error === 'object') {
    const withError = error as {
      code?: unknown
      message?: unknown
      fieldErrors?: unknown
      error?: {
        code?: unknown
        message?: unknown
        fieldErrors?: unknown
      }
    }

    const embeddedError = withError.error ?? withError

    if (
      isServerErrorCode(embeddedError.code) &&
      typeof embeddedError.message === 'string'
    ) {
      return fail(
        embeddedError.code,
        embeddedError.message,
        embeddedError.fieldErrors as Record<string, Array<string>> | undefined,
      )
    }
  }

  if (error instanceof Error) {
    const message = error.message.trim()
    const code = mapMessageToCode(message)
    return fail(code, code === 'INTERNAL' ? 'Something went wrong' : message)
  }

  return fail('INTERNAL', 'Something went wrong')
}
