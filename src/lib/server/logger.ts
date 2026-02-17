import { brandConfig } from '@/components/brand/brand.config'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogContext = Record<string, unknown>

type LogPayload = LogContext & {
  event: string
}

const serializeError = (value: unknown) => {
  if (!(value instanceof Error)) return value
  return {
    name: value.name,
    message: value.message,
    stack: value.stack,
  }
}

const emit = (level: LogLevel, payload: LogPayload) => {
  const body = JSON.stringify(
    {
      level,
      timestamp: new Date().toISOString(),
      ...payload,
    },
    (_key, value) => serializeError(value),
  )

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

const withContext = (baseContext: LogContext = {}) => ({
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

export const logger = withContext({ service: brandConfig.serviceName })
