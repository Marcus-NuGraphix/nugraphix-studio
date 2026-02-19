import { brandConfig } from '@/components/brand/brand.config'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type Primitive = string | number | boolean | null

export type LogContext = Record<string, unknown>

export interface Logger {
  child: (context: LogContext) => Logger
  debug: (event: string, context?: LogContext) => void
  info: (event: string, context?: LogContext) => void
  warn: (event: string, context?: LogContext) => void
  error: (event: string, context?: LogContext) => void
}

interface LogPayload extends LogContext {
  event: string
}

const REDACTED = '[REDACTED]'

const SENSITIVE_KEY_PATTERN =
  /password|token|secret|authorization|cookie|api[-_]?key|session|credential/i

const shouldRedactKey = (key: string) => SENSITIVE_KEY_PATTERN.test(key)

const serializeError = (error: Error): Record<string, unknown> => ({
  name: error.name,
  message: error.message,
  stack: error.stack,
  cause: error.cause instanceof Error ? serializeError(error.cause) : undefined,
})

const sanitizeLogValue = (
  value: unknown,
  keyPath: Array<string> = [],
): Primitive | Record<string, unknown> | Array<unknown> => {
  if (value instanceof Error) {
    return serializeError(value)
  }

  if (value === null) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      sanitizeLogValue(item, [...keyPath, String(index)]),
    )
  }

  if (typeof value === 'object') {
    const output: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      if (shouldRedactKey(key)) {
        output[key] = REDACTED
        continue
      }

      output[key] = sanitizeLogValue(item, [...keyPath, key])
    }

    return output
  }

  return String(value)
}

const sanitizeLogContext = (value: LogContext): Record<string, unknown> => {
  const sanitized = sanitizeLogValue(value)
  if (sanitized && typeof sanitized === 'object' && !Array.isArray(sanitized)) {
    return sanitized
  }

  return {}
}

const isDebugEnabled = () => process.env.NODE_ENV !== 'production'

const emit = (level: LogLevel, payload: LogPayload) => {
  if (level === 'debug' && !isDebugEnabled()) {
    return
  }

  const body = JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    ...sanitizeLogContext(payload),
  })

  if (level === 'error') {
    console.error(body)
    return
  }

  if (level === 'warn') {
    console.warn(body)
    return
  }

  console.log(body)
}

const withContext = (baseContext: LogContext = {}): Logger => ({
  child(context: LogContext) {
    return withContext({ ...baseContext, ...context })
  },
  debug(event: string, context?: LogContext) {
    emit('debug', { ...baseContext, ...context, event })
  },
  info(event: string, context?: LogContext) {
    emit('info', { ...baseContext, ...context, event })
  },
  warn(event: string, context?: LogContext) {
    emit('warn', { ...baseContext, ...context, event })
  },
  error(event: string, context?: LogContext) {
    emit('error', { ...baseContext, ...context, event })
  },
})

export const logger = withContext({
  service: brandConfig.serviceName,
  app: brandConfig.productName,
})
