import { LOG_LEVELS } from './interfaces/Logger.js';
import { calcAllowedLogLevels } from './common.js';
export class ConsoleLogger {
    allowDebug;
    allowInfo;
    allowWarn;
    constructor(level = 'info') {
        const allowedLogLevels = calcAllowedLogLevels(level);
        this.allowDebug = allowedLogLevels.includes(LOG_LEVELS.debug);
        this.allowInfo = allowedLogLevels.includes(LOG_LEVELS.info);
        this.allowWarn = allowedLogLevels.includes(LOG_LEVELS.warn);
    }
    debug = (message) => {
        if (!this.allowDebug)
            return;
        console.info(`DEBUG: ${message}`);
    };
    info = (message) => {
        if (!this.allowInfo)
            return;
        console.info(`INFO: ${message}`);
    };
    warn = (message) => {
        if (!this.allowWarn)
            return;
        console.warn(`WARNING: ${message}`);
    };
    error = (message) => {
        console.error(`ERROR: ${message}`);
    };
    log = (message) => {
        console.info(`LOG: ${message}`);
    };
}
