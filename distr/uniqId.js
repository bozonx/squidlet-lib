import hashSum from './hashSum.js';
let counter = Number.MIN_SAFE_INTEGER + Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER));
let instanceId;
function randomInt() {
    return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER));
}
/**
 * Generate unique number.
 * It increments a counter on each call.
 * Counter is initialized with a random value.
 */
export function makeUniqNumber() {
    counter++;
    if (counter === Number.MAX_SAFE_INTEGER) {
        counter = Number.MIN_SAFE_INTEGER;
    }
    return counter;
}
/**
 * It returns id of runtime. This id is generating on first call of this function.
 * This id will never changed while runtime.
 * It contains of 8 chars.
 */
export function getRuntimeId() {
    if (typeof instanceId === 'undefined') {
        instanceId = hashSum(String(randomInt()) + String(randomInt()));
    }
    return instanceId;
}
/**
 * Make always a unique id which contains of 8 chars.
 */
export function makeUniqId(bytes = 8) {
    // TODO: добавить задание числа байт
    const str = getRuntimeId() + String(makeUniqNumber());
    return hashSum(str);
}
