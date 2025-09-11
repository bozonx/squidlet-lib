import { LogLevels } from './interfaces/Logger.js'

type EventHandler = (logLevel: LogLevels, msg: string) => void

export class LogPublisher {
  private readonly eventHandler: EventHandler

  constructor(eventHandler: EventHandler) {
    this.eventHandler = eventHandler
  }

  debug = (message: string) => {
    this.eventHandler(LogLevels.debug, message)
  }

  log = (message: string) => {
    this.eventHandler(LogLevels.log, message)
  }

  info = (message: string) => {
    this.eventHandler(LogLevels.info, message)
  }

  warn = (message: string) => {
    this.eventHandler(LogLevels.warn, message)
  }

  error = (message: string | Error) => {
    this.eventHandler(LogLevels.error, String(message))
  }
}
