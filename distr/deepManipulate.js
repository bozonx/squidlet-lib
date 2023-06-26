import { trimCharStart } from './strings.js';
import { cloneDeepArray, isArrayIncludesIndex, lastItem, withoutFirstItem, withoutLastItem } from './arrays.js';
import { cloneDeepObject } from './deepObjects.js';
const DEEP_PATH_SEPARATOR = '.';
export const DONT_GO_DEEPER = Symbol('DONT_GO_DEEPER');
/**
 * Split deep path to paths
 * E.g "aa[0].bb[1].cc" => ['aa', 0, 'bb', 1, 'cc']
 * @param pathTo
 */
export function splitDeepPath(pathTo) {
    if (!pathTo || typeof pathTo !== 'string')
        return [];
    const res = [];
    const preparedPath = pathTo.replace(/\[/g, DEEP_PATH_SEPARATOR + '[');
    const splatDots = trimCharStart(preparedPath, DEEP_PATH_SEPARATOR)
        .split(DEEP_PATH_SEPARATOR);
    splatDots.forEach((el) => {
        if (el.indexOf('[') === 0) {
            // it is only array index - [0]
            const index = Number(el.match(/\d+/)[0]);
            res.push(index);
        }
        else {
            // only key as string
            res.push(el);
        }
    });
    return res;
}
/**
 * Join deep path parts to string
 * E.g ['aa', 0, 'bb', 1, 'cc'] => "aa[0].bb[1].cc"
 * @param pathParts
 */
export function joinDeepPath(pathParts) {
    if (!Array.isArray(pathParts) || !pathParts.length)
        return '';
    let result = '';
    for (const item of pathParts) {
        if (typeof item === 'number') {
            result += `[${item}]`;
        }
        else if (typeof item === 'string' && item) {
            result += DEEP_PATH_SEPARATOR + item;
        }
        else {
            // if empty string or undefined - do nothing
        }
    }
    return trimCharStart(result, DEEP_PATH_SEPARATOR);
}
/**
 * Get value deeply from object or array.
 * @param src - object or array
 * @param pathTo - path like obj.arr[0].param
 * @param defaultValue - value which will be returned in case value not found
 */
export function deepGet(src, pathTo, defaultValue) {
    if (typeof src === 'undefined')
        return defaultValue;
    else if (typeof pathTo !== 'string')
        return defaultValue;
    const splatPath = splitDeepPath(pathTo);
    const restPath = joinDeepPath(withoutFirstItem(splatPath));
    if (Array.isArray(src)) {
        // means wrong path
        if (typeof splatPath[0] !== 'number')
            return defaultValue;
        const arrIndex = splatPath[0];
        if (restPath) {
            // go deeper
            return deepGet(src[arrIndex], restPath, defaultValue);
        }
        else {
            // found final value
            if (isArrayIncludesIndex(src, arrIndex)) {
                return src[arrIndex];
            }
            return defaultValue;
        }
    }
    // not null and object
    else if (src && typeof src === 'object') {
        // if not string that means wrong path - return default value
        if (typeof splatPath[0] !== 'string')
            return defaultValue;
        let currentKey = splatPath[0];
        if (restPath) {
            // go deeper
            return deepGet(src[currentKey], restPath, defaultValue);
        }
        else {
            // found final value
            if (Reflect.ownKeys(src).includes(currentKey)) {
                return src[currentKey];
            }
            // not found a key
            return defaultValue;
        }
    }
    else {
        // if it isn't object or array then just return defaultValue or undefined
        return defaultValue;
    }
}
/**
 * Get parent if path is deep.
 * Or return itself if path is only one element.
 * Be careful if path points to array then array will be returned
 * @param src - object or array where to find parent
 * @param pathTo - full path to parameter of parent
 * @param strict - if true then it will check does key exist in parent
 * @return - [parent, paramKey, parentPath]
 */
export function deepGetParent(src, pathTo, strict = false) {
    if (!src || (!Array.isArray(src) && typeof src !== 'object'))
        return [];
    else if (typeof pathTo !== 'string' || !pathTo)
        return [];
    const splatPath = splitDeepPath(pathTo);
    const parentPath = joinDeepPath(withoutLastItem(splatPath));
    const paramKey = lastItem(splatPath);
    // if can't find anything. But it shouldn't be
    if (typeof paramKey === 'undefined')
        return [];
    const parent = (parentPath)
        // get parent
        ? deepGet(src, parentPath)
        // use src
        : src;
    if (!parent)
        return [];
    if (strict) {
        if (Array.isArray(parent) && Number(paramKey) >= parent.length)
            return [];
        else if (typeof parent === 'object' && !Object.keys(parent).includes(String(paramKey))) {
            return [];
        }
    }
    return [parent, paramKey, parentPath || ''];
}
export function deepHas(src, pathTo) {
    const [, paramKey] = deepGetParent(src, pathTo, true);
    return typeof paramKey !== 'undefined';
}
export function deepSet(src, pathTo, value) {
    const [parent, paramKey] = deepGetParent(src, pathTo);
    // it can be object or array
    if (parent && typeof paramKey !== 'undefined') {
        parent[paramKey] = value;
        return true;
    }
    return false;
}
/**
 * It will delete item from object or array.
 * In case of array instead of item will be undefined.
 * @param src
 * @param pathTo
 */
export function deepDelete(src, pathTo) {
    const [parent, lastPathPart] = deepGetParent(src, pathTo, true);
    // it can be object or array
    if (parent && typeof lastPathPart !== 'undefined') {
        delete parent[lastPathPart];
        return true;
    }
    return false;
}
export function deepClone(src) {
    if (Array.isArray(src)) {
        return cloneDeepArray(src);
    }
    else if (typeof src === 'object') {
        return cloneDeepObject(src);
    }
    return src;
}
// TODO: test
// TODO: ass symbol - dontGoDeeper
/**
 * Find object by checking its properties
 * @param src
 * @param handler
 * @param initialPath - path to the object in src
 */
export function deepFindObj(src, handler, initialPath) {
    if (!handler || !src || (!Array.isArray(src) && typeof src !== 'object'))
        return;
    if (Array.isArray(src)) {
        // go deep to each item of array
        for (const key of src.keys()) {
            const item = src[key];
            const path = joinDeepPath([initialPath, key]);
            const res = deepFindObj(item, handler, path);
            if (res)
                return res;
        }
    }
    else {
        // object
        for (const key of Object.keys(src)) {
            const path = joinDeepPath([initialPath, key]);
            const res = handler(src[key], key, path);
            // if it shouldn't go deeper than continue
            if (res === DONT_GO_DEEPER)
                continue;
            // if found
            else if (res)
                return src[key];
            // else go deeper to each key of object
            else {
                const deepRes = deepFindObj(src[key], handler, path);
                if (deepRes)
                    return deepRes;
            }
        }
    }
    // if not found return undefined
}
// TODO: test
// TODO: add path to handler
// TODO: как это объединить с deepFindObj ???
/**
 * Find object by checking its properties
 * @param src
 * @param handler,
 * @param initialPath - path to the object in src
 */
export async function deepFindObjAsync(src, handler, initialPath) {
    if (!handler || !src || (!Array.isArray(src) && typeof src !== 'object'))
        return;
    if (Array.isArray(src)) {
        // go deep to each item of array
        for (const key of src.keys()) {
            const item = src[key];
            const path = joinDeepPath([initialPath, key]);
            const res = deepFindObjAsync(item, handler, path);
            if (res)
                return res;
        }
    }
    else {
        // object
        for (const key of Object.keys(src)) {
            const path = joinDeepPath([initialPath, key]);
            const res = await handler(src[key], key, path);
            // if it shouldn't go deeper than continue
            if (res === DONT_GO_DEEPER)
                continue;
            // if found
            else if (res)
                return src[key];
            // else go deeper to each key of object
            else {
                const deepRes = deepFindObjAsync(src[key], handler, path);
                if (deepRes)
                    return deepRes;
            }
        }
    }
    // if not found return undefined
}
// TODO: test
/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 */
export function deepEachObj(src, handler, initialPath) {
    deepFindObj(src, handler, initialPath);
}
// TODO: test
// TODO: както надо объединить с deepEachObj
/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 */
export async function deepEachObjAsync(src, handler, initialPath) {
    await deepFindObjAsync(src, handler, initialPath);
}
export function isSameDeep(obj1, obj2) {
    // TODO: поддержка массивов
    if (obj1 === obj2)
        return true;
    else if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object')
        return false;
    else if (!Object.keys(obj1).length)
        return false;
    else if (Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;
    for (const [key, value] of Object.entries(obj1)) {
        // TODO: use isPlainObject
        if (value && typeof value === 'object' && typeof obj2[key] === 'object') {
            const res = isSameDeep(value, obj2[key]);
            if (!res)
                return false;
            // if true then continue
        }
        else {
            if (obj1[key] !== obj2[key])
                return false;
            // the just continue
        }
    }
    return true;
}
