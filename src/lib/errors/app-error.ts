import type { ServerErrorCode } from './server-result'

export interface AppErrorOptions {
  cause?: unknown
  fieldErrors?: Record<string, Array<string>>
}

const isFieldErrorMap = (
  value: unknown,
): value is Record<string, Array<string>> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every(
    (item) =>
      Array.isArray(item) && item.every((entry) => typeof entry === 'string'),
  )
}

const isAppErrorOptions = (value: unknown): value is AppErrorOptions => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const keys = Object.keys(value)
  if (keys.length === 0) {
    return false
  }

  const allowedKeys = new Set(['cause', 'fieldErrors'])
  return keys.every((key) => allowedKeys.has(key))
}

export class AppError extends Error {
  readonly code: ServerErrorCode
  readonly fieldErrors?: Record<string, Array<string>>

  constructor(
    code: ServerErrorCode,
    message: string,
    fieldErrorsOrOptions?:
      | Record<string, Array<string>>
      | AppErrorOptions,
  ) {
    const options = isAppErrorOptions(fieldErrorsOrOptions)
      ? fieldErrorsOrOptions
      : undefined

    super(message, { cause: options?.cause })
    this.name = 'AppError'
    this.code = code
    const fieldErrors = isFieldErrorMap(fieldErrorsOrOptions)
      ? fieldErrorsOrOptions
      : options?.fieldErrors
    this.fieldErrors = fieldErrors

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
