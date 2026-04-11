/**
 * Structured Logger for AyuraHealth.
 * 
 * Outputs JSON-structured logs for observability.
 * In production, these can be consumed by Vercel Logs, Datadog, etc.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  event: string
  timestamp: string
  data?: Record<string, unknown>
}

function emit(level: LogLevel, event: string, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...(data ? { data } : {}),
  }

  const json = JSON.stringify(entry)

  switch (level) {
    case 'error':
      console.error(json)
      break
    case 'warn':
      console.warn(json)
      break
    case 'debug':
      if (process.env.NODE_ENV !== 'production') {
        console.debug(json)
      }
      break
    default:
      console.log(json)
  }
}

export const log = {
  debug: (event: string, data?: Record<string, unknown>) => emit('debug', event, data),
  info: (event: string, data?: Record<string, unknown>) => emit('info', event, data),
  warn: (event: string, data?: Record<string, unknown>) => emit('warn', event, data),
  error: (event: string, data?: Record<string, unknown>) => emit('error', event, data),
}
