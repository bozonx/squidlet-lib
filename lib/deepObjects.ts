import {cloneDeepArray} from './arrays.js';
import {deepGet} from './deepManipulate.js';
import {isPlainObject} from './objects.js';


// TODO: review and review tests
/**
 * Merges two objects deeply.
 * It doesn't mutate any object.
 * If you obviously set undefined to one of top's param - it will removes this key from the result object.
 * Arrays will be cloned.
 * It clones the top object.
 */
export function mergeDeepObjects<T = Record<string, any>>(
  top: Record<string, any> = {},
  bottom: Record<string, any> = {}
): T {
  const result: Record<string, any> = {}
  const topUndefinedKeys: string[] = []

  if (typeof top !== 'object' || typeof bottom !== 'object') {
    throw new Error(`mergeDeepObjects: top and bottom has to be objects`)
  }

  // Sort undefined keys.
  // Get only not undefined values to result and collect keys which has a undefined values.
  for (let key of Object.keys(top)) {
    if (typeof top[key] === 'undefined') {
      topUndefinedKeys.push(key)
    }
    else {
      if (Array.isArray(top[key])) {
        result[key] = cloneDeepArray(top[key])
      }
      else {
        result[key] = top[key]
      }
    }
  }

  for (let key of Object.keys(bottom)) {
    if (!(key in result) && !topUndefinedKeys.includes(key)) {
      // set value which is absent on top but exist on the bottom.
      // only if it obviously doesn't mark as undefined
      if (Array.isArray(bottom[key])) {
        result[key] = cloneDeepArray(bottom[key])
      }
      else {
        result[key] = bottom[key]
      }
    }
    // go deeper if bottom and top are objects
    else if (isPlainObject(result[key]) && isPlainObject(bottom[key])) {
      result[key] = mergeDeepObjects(result[key], bottom[key])
    }
    // else - skip
  }

  return result as T
}

/**
 * Clone object deeply.
 */
export function cloneDeepObject<T = Record<string, any>>(
obj?: {[index: string]: any}
): T {
  return mergeDeepObjects<T>({}, obj)
}


// TODO: test
/**
 * Sort keys of object recursively.
 * Arrays won't be sorted.
 */
export function sortObject(preObj: Record<string, any>): Record<string, any> {
  const sortedKeys = Object.keys(preObj).sort();
  const result: Record<string, any> = {};

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


// TODO: поидее не собо нужно так как не поддерживает массивы. Вместо него использовать deepGet
/**
 * Get value from deep object.
 * If there isn't a value or node undefined or default value will be returned.
 * WARNING: arrays doesn't supported!
 */
export function objGet(obj?: {[index: string]: any}, pathTo?: string, defaultValue?: any): any {
  if (!obj || !pathTo) return defaultValue;

  const recursive = (currentObj: {[index: string]: any}, currentPath: string): any => {
    for (let itemName of Object.keys(currentObj)) {
      const pathOfItem: string = (currentPath) ? [currentPath, itemName].join('.') : itemName;

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

  const result: any = recursive(obj, '');

  if (typeof result === 'undefined' && typeof defaultValue !== 'undefined') return defaultValue;

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
export function objSetMutate(obj: Record<string, any>, pathTo: string, value: any) {
  const pathSplat: string[] = pathTo.split('.')
  let currentDir = obj

  for (const index in pathSplat) {
    const curDirName = pathSplat[index]

    if (Number(index) === pathSplat.length - 1) {
      // the last element
      currentDir[curDirName] = value
    }
    else {
      // in the middle
      // create dir if not exist
      if (!currentDir[curDirName]) {
        currentDir[curDirName] = {}
        currentDir = currentDir[curDirName]
      }
    }
  }
}
