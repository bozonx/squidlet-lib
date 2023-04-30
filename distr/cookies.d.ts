import { Primitives } from './interfaces/Types.js';
/**
 * Parse cookie like "param1=value1; param2=value2;" to { param1: 'value1', param2: 'value2' }
 * example - lang=ru-RU; gdpr-cookie-consent=accepted;
 */
export declare function parseCookie(cookies?: string): {
    [index: string]: Primitives;
};
export declare function stringifyCookie(obj: {
    [index: string]: Primitives;
}): string;
