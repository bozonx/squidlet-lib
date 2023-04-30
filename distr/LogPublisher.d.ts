import { LogLevel } from './interfaces/Logger.js';
type EventHandler = (logLevel: LogLevel, msg: string) => void;
export declare class LogPublisher {
    private readonly eventHandler;
    constructor(eventHandler: EventHandler);
    debug(message: string): void;
    log(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string | Error): void;
}
export {};
