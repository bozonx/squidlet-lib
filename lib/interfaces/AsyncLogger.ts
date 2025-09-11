export interface AsyncLogger {
  debug: (msg: string) => Promise<void>
  info: (msg: string) => Promise<void>
  warn: (msg: string) => Promise<void>
  error: (msg: string) => Promise<void>
  /** Means emit in any case not depends on log level */
  log: (msg: string) => Promise<void>
}
