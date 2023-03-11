import {LogLevel} from './interfaces/Logger.js'


type EventHandler = (logLevel: LogLevel, msg: string) => void


export class LogPublisher {
  private readonly eventHandler: EventHandler


  constructor(eventHandler: EventHandler) {
    this.eventHandler = eventHandler
  }


  debug(message: string) {
    this.eventHandler('debug', message)
  }


  log(message: string) {
    this.eventHandler('log', message)
  }

  info(message: string) {
    this.eventHandler('info', message)
  }

  warn(message: string) {
    this.eventHandler('warn', message)
  }

  error(message: string | Error) {
    this.eventHandler('error', String(message))
  }

}
