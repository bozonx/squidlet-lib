export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'log'

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'log']

export interface Logger {
  debug: (msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
  error: (msg: string) => void
  /**
   * Means emit in any case not depends on log level
   */
  log: (msg: string) => void
}
