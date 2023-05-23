import { isEqualUint8Array } from './binaryHelpers.js';
import { concatUniqStrArrays } from './arrays.js';
import { LOG_LEVELS } from './interfaces/Logger.js';
// TODO: add isEmpty - общий для объектов и массивов
/**
 * Compare any types and check equality of two values.
 */
export function isEqual(first, second) {
    // primitives and null
    if (typeof first !== 'object' || typeof second !== 'object' || !first || !second) {
        return first === second;
    }
    // uint
    else if (first instanceof Uint8Array || second instanceof Uint8Array) {
        return isEqualUint8Array(first, second);
    }
    // arrays
    else if (Array.isArray(first) && Array.isArray(second)) {
        if (first.length !== second.length)
            return false;
        for (let key in first) {
            if (!isEqual(first[key], second[key]))
                return false;
        }
        return true;
    }
    // plain objects and instances
    else if (typeof first === 'object' && typeof second === 'object') {
        const firstKeys = Object.keys(first);
        // keys of both objects
        const keys = concatUniqStrArrays(firstKeys, Object.keys(second));
        for (let key of keys) {
            if (!isEqual(first[key], second[key]))
                return false;
        }
        return true;
    }
    // for the any other case when smb is undefined
    return first === first;
}
/**
 * Parse string numbers and constants to pure numbers and constants
 */
export function parseValue(rawValue) {
    if (typeof rawValue !== 'string') {
        return rawValue;
    }
    else if (rawValue === 'true') {
        return true;
    }
    else if (rawValue === 'false') {
        return false;
    }
    else if (rawValue === 'undefined') {
        return undefined;
    }
    else if (rawValue === 'null') {
        return null;
    }
    else if (rawValue === 'NaN') {
        return NaN;
    }
    // it is for - 2. strings
    else if (rawValue.match(/^\d+\.$/)) {
        return rawValue;
    }
    const toNumber = Number(rawValue);
    if (!Number.isNaN(toNumber)) {
        // it's number
        return toNumber;
    }
    // string returns as they are
    return rawValue;
}
/**
 * Call error-first callback functions like a promised
 */
export function callPromised(method, ...params) {
    return new Promise((resolve, reject) => {
        try {
            method(...params, (err, data) => {
                if (err)
                    return reject(err);
                resolve(data);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
// TODO: test
/**
 * Call function which is returns promise safely
 */
export function callSafely(method, ...params) {
    try {
        const result = method(...params);
        if (isPromise(result)) {
            return result;
        }
        else {
            return Promise.resolve(result);
        }
    }
    catch (e) {
        return Promise.reject(e);
    }
}
/**
 * Is number or number as string.
 */
export function isKindOfNumber(value) {
    if (typeof value === 'string') {
        return !Number.isNaN(Number(value));
    }
    return typeof value === 'number';
}
export function isPromise(toCheck) {
    return toCheck
        && typeof toCheck === 'object'
        && typeof toCheck.then === 'function'
        || false;
}
/**
 * Makes ['info', 'warn', 'error'] if log level is 'info'
 */
export function calcAllowedLogLevels(logLevel) {
    const logLevels = Object.keys(LOG_LEVELS);
    const currentLevelIndex = logLevels.indexOf(logLevel);
    return logLevels.slice(currentLevelIndex);
}
// /**
//  * When undefined, null, '', [] or {}.
//  * 0 is not empty!
//  * @param toCheck
//  */
// TODO: test
export function handleLogEvent(logger) {
    return (logLevel, msg) => {
        switch (logLevel) {
            case 'debug':
                return logger.debug(msg);
            case 'info':
                return logger.info(msg);
            case 'warn':
                return logger.warn(msg);
            case 'error':
                return logger.error(msg);
            case 'log':
                return logger.log(msg);
        }
    };
}
