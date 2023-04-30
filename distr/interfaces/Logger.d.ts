export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'log';
export declare const LOG_LEVELS: Record<LogLevel, LogLevel>;
export interface Logger {
    debug: (msg: string) => void;
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    /**
     * Means emit in any case not depends on log level
     */
    log: (msg: string) => void;
}
