import {Logger, LogLevel, LOG_LEVELS} from './interfaces/Logger.js'
import {calcAllowedLogLevels} from './common.js'


export class ConsoleLogger implements Logger {
  private readonly allowDebug: boolean
  private readonly allowInfo: boolean
  private readonly allowWarn: boolean


  constructor(level: LogLevel = 'info') {
    const allowedLogLevels: LogLevel[] = calcAllowedLogLevels(level)

    this.allowDebug = allowedLogLevels.includes(LOG_LEVELS.debug);
    this.allowInfo = allowedLogLevels.includes(LOG_LEVELS.info);
    this.allowWarn = allowedLogLevels.includes(LOG_LEVELS.warn);
  }


  debug = (message: string) => {
    if (!this.allowDebug) return

    console.info(`DEBUG: ${message}`)
  }

  info = (message: string) => {
    if (!this.allowInfo) return

    console.info(`INFO: ${message}`)
  }

  warn = (message: string) => {
    if (!this.allowWarn) return

    console.warn(`WARNING: ${message}`)
  }

  error = (message: string | Error) => {
    console.error(`ERROR: ${message}`)
  }

  log = (message: string) => {
    console.info(`LOG: ${message}`)
  }

  // handler(level: LogLevel, message: string) {
  //   this[level](message)
  // }

}
