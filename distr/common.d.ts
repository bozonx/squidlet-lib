import { Logger, LogLevel } from './interfaces/Logger.js';
/**
 * If it is undefined or null then true
 * If it is an array then check its length
 * If it is an object then check its keys length
 * If it is an empty string then true
 * In other cases: (boolean, 0, number etc) it returns false
 * @param some
 */
export declare function isEmpty(some?: any | any[]): boolean;
/**
 * Compare any types and check equality of two values.
 */
export declare function isEqual(first: any, second: any): boolean;
/**
 * Parse string numbers and constants to pure numbers and constants
 */
export declare function parseValue(rawValue: any): any;
/**
 * Call error-first callback functions like a promised
 */
export declare function callPromised(method: Function, ...params: any[]): Promise<any>;
/**
 * Call function which is returns promise safely
 */
export declare function callSafely(method: (...params: any[]) => Promise<any>, ...params: any[]): Promise<any>;
/**
 * Is number or number as string.
 */
export declare function isKindOfNumber(value: any): boolean;
export declare function isPromise(toCheck: any): boolean;
/**
 * Makes ['info', 'warn', 'error'] if log level is 'info'
 */
export declare function calcAllowedLogLevels(logLevel: LogLevel): LogLevel[];
export declare function handleLogEvent(logger: Logger): (logLevel: LogLevel, msg: string) => void;
