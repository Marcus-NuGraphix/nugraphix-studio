export type ServerErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL'

export type ServerFail = {
  ok: false
  error: {
    code: ServerErrorCode
    message: string
    fieldErrors?: Record<string, Array<string>>
  }
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
