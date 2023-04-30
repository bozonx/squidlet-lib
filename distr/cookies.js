import { parseValue } from './common.js';
/**
 * Parse cookie like "param1=value1; param2=value2;" to { param1: 'value1', param2: 'value2' }
 * example - lang=ru-RU; gdpr-cookie-consent=accepted;
 */
export function parseCookie(cookies) {
    if (!cookies)
        return {};
    const splat = cookies.split(';');
    const result = {};
    for (let item of splat) {
        const [key, value] = item.split('=');
        result[key.trim()] = parseValue((value || '').trim());
    }
    return result;
}
export function stringifyCookie(obj) {
    const result = [];
    for (let key of Object.keys(obj)) {
        const value = obj[key];
        if (value && typeof value === 'object') {
            throw new Error(`stringifyCookie: invalid type of value: ${typeof value}`);
        }
        result.push(`${key}=${value}`);
    }
    return result.join('; ');
}
