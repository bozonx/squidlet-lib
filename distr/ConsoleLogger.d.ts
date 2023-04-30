import { Logger, LogLevel } from './interfaces/Logger.js';
export declare class ConsoleLogger implements Logger {
    private readonly allowDebug;
    private readonly allowInfo;
    private readonly allowWarn;
    constructor(level?: LogLevel);
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string | Error) => void;
    log: (message: string) => void;
}
