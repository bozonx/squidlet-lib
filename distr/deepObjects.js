import { cloneDeepArray } from './arrays.js';
import { isPlainObject } from './objects.js';
// TODO: review and review tests
// TODO: move to object.ts
/**
 * Merges two objects deeply.
 * It doesn't mutate any object.
 * If you obviously set undefined to one of top's param - it will removes this key from the result object.
 * Arrays will be cloned.
 * It clones the top object.
 */
export function mergeDeepObjects(top = {}, bottom = {}) {
    const result = {};
    const topUndefinedKeys = [];
    if (typeof top !== 'object' || typeof bottom !== 'object') {
        throw new Error(`mergeDeepObjects: top and bottom has to be objects`);
    }
    // Sort undefined keys.
    // Get only not undefined values to result and collect keys which has a undefined values.
    for (const key of Object.keys(top)) {
        if (typeof top[key] === 'undefined') {
            topUndefinedKeys.push(key);
        }
        else {
            if (Array.isArray(top[key])) {
                result[key] = cloneDeepArray(top[key]);
            }
            else {
                result[key] = top[key];
            }
        }
    }
    for (let key of Object.keys(bottom)) {
        if (!(key in result) && !topUndefinedKeys.includes(key)) {
            // set value which is absent on top but exist on the bottom.
            // only if it obviously doesn't mark as undefined
            if (Array.isArray(bottom[key])) {
                result[key] = cloneDeepArray(bottom[key]);
            }
            else {
                result[key] = bottom[key];
            }
        }
        // go deeper if bottom and top are objects
        else if (isPlainObject(result[key]) && isPlainObject(bottom[key])) {
            result[key] = mergeDeepObjects(result[key], bottom[key]);
        }
        // else - skip
    }
    return result;
}
// TODO: review and review tests
/**
 * Clone object deeply.
 */
export function cloneDeepObject(obj) {
    return mergeDeepObjects({}, obj);
}
// TODO: test
/**
 * Sort keys of object recursively.
 * Arrays won't be sorted.
 */
export function sortObject(preObj) {
    const sortedKeys = Object.keys(preObj).sort();
    const result = {};
    for (let key of sortedKeys) {
        if (Array.isArray(preObj[key])) {
            // don't sort arrays
            result[key] = preObj[key];
        }
        else if (typeof preObj[key] === 'object') {
            // sort recursively
            result[key] = sortObject(preObj[key]);
        }
        else {
            // other primitives
            result[key] = preObj[key];
        }
    }
    return result;
}
