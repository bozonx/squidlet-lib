import { splitFirstElement, trimCharStart } from './strings.js';
import { cloneDeepArray, isArrayIncludesIndex } from './arrays.js';
import { cloneDeepObject } from './deepObjects.js';
const DEEP_PATH_SEPARATOR = '.';
export function deepGet(src, pathTo, defaultValue) {
    if (typeof src === 'undefined')
        return defaultValue;
    else if (typeof pathTo !== 'string')
        return defaultValue;
    if (Array.isArray(src)) {
        const match = pathTo.match(/^\[(\d+)\](.*)$/);
        // means wrong path
        if (!match || !match[1])
            return defaultValue;
        const arrIndex = Number(match[1]);
        const restPath = trimCharStart(match[2], DEEP_PATH_SEPARATOR);
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
        // try to find an array
        const arrMatch = pathTo.match(/^([^.]+)\[/);
        let currentKey;
        let restPath;
        if (arrMatch) {
            currentKey = arrMatch[1];
            restPath = pathTo.split(currentKey)[1];
        }
        else {
            [currentKey, restPath] = splitFirstElement(pathTo, DEEP_PATH_SEPARATOR);
        }
        if (!currentKey) {
            return defaultValue;
        }
        else if (!restPath) {
            // found final value
            if (Object.keys(src).includes(currentKey)) {
                return src[currentKey];
            }
            return defaultValue;
        }
        else {
            // go deeper
            return deepGet(src[currentKey], restPath, defaultValue);
        }
    }
    else {
        // if it isn't object or array then just return defaultValue or undefined
        return defaultValue;
    }
}
export function deepSet(src, pathTo, value) {
}
export function deepDelete(src, pathTo) {
    //const [child, pathToParent] = splitLastElement(path, '.')
    // TODO: взять родителя и у него удалить потомка
    // TODO: поддержка массивов
}
export function deepClone(src) {
    console.log(333, src);
    if (Array.isArray(src)) {
        return cloneDeepArray(src);
    }
    else if (typeof src === 'object') {
        return cloneDeepObject(src);
    }
    return src;
}
// TODO: поидее не собо нужно так как не поддерживает массивы. Вместо него использовать deepGet
/**
 * Get value from deep object.
 * If there isn't a value or node undefined or default value will be returned.
 * WARNING: arrays doesn't supported!
 */
export function objGet(obj, pathTo, defaultValue) {
    if (!obj || !pathTo)
        return defaultValue;
    const recursive = (currentObj, currentPath) => {
        for (let itemName of Object.keys(currentObj)) {
            const pathOfItem = (currentPath) ? [currentPath, itemName].join('.') : itemName;
            if (pathTo.indexOf(pathOfItem) !== 0) {
                // lost path
                return;
            }
            else if (pathOfItem === pathTo) {
                // found
                return currentObj[itemName];
            }
            else if (Array.isArray(currentObj[itemName])) {
                // arrays aren't supported
                return;
            }
            // got deeper
            else if (typeof currentObj[itemName] === 'object') {
                return recursive(currentObj[itemName], pathOfItem);
            }
            // else do nothing
        }
    };
    const result = recursive(obj, '');
    if (typeof result === 'undefined' && typeof defaultValue !== 'undefined')
        return defaultValue;
    return result;
}
// TODO: test
// TODO: не особо нужно, так как не работает с массивами
/**
 * Set value deeply to object and create nodes if need.
 * It mutates the object
 * @param obj
 * @param pathTo - path like parnent.node1.node2
 * @param value
 */
export function objSetMutate(obj, pathTo, value) {
    const pathSplat = pathTo.split('.');
    let currentDir = obj;
    for (const index in pathSplat) {
        const curDirName = pathSplat[index];
        if (Number(index) === pathSplat.length - 1) {
            // the last element
            currentDir[curDirName] = value;
        }
        else {
            // in the middle
            // create dir if not exist
            if (!currentDir[curDirName]) {
                currentDir[curDirName] = {};
                currentDir = currentDir[curDirName];
            }
        }
    }
}
