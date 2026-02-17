export const serverErrorCodes = [
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'CONFLICT',
  'RATE_LIMITED',
  'INTERNAL',
] as const

export type ServerErrorCode = (typeof serverErrorCodes)[number]

export interface ServerError {
  code: ServerErrorCode
  message: string
  fieldErrors?: Record<string, Array<string>>
}

export type ServerFail = {
  ok: false
  error: ServerError
}

export type ServerOk<T> = { ok: true; data: T }

export type ServerResult<T> = ServerOk<T> | ServerFail

export const ok = <T>(data: T): ServerOk<T> => ({ ok: true, data })

export const fail = (
  code: ServerErrorCode,
  message: string,
  fieldErrors?: Record<string, Array<string>>,
): ServerFail => ({
  ok: false,
  error: { code, message, fieldErrors },
})

export const isServerOk = <T>(result: ServerResult<T>): result is ServerOk<T> =>
  result.ok

export const isServerFail = <T>(
  result: ServerResult<T>,
): result is ServerFail => !result.ok

export const isServerResult = <T>(value: unknown): value is ServerResult<T> => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const result = value as Partial<ServerResult<T>>
  return typeof result.ok === 'boolean'
}
