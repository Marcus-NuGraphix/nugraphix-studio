import type { ServerErrorCode } from './server-result'

export class AppError extends Error {
  code: ServerErrorCode
  fieldErrors?: Record<string, Array<string>>

  constructor(
    code: ServerErrorCode,
    message: string,
    fieldErrors?: Record<string, Array<string>>,
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.fieldErrors = fieldErrors
  }
}
