import {cloneDeepArray} from './arrays.js';
import {deepGet} from './deepManipulate.js';


/**
 * Get all the class members include prototype's exclude "constructor".
 */
export function getAllTheClassMembers(obj: Object, exclude: string[] = []): string[] {
  const props: string[] = [
    ...Object.getOwnPropertyNames(obj),
    // TODO: maybe make getting prototypes recursive ?
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(obj)),
  ];

  const excludeProps: string[] = [
    'constructor',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    '__proto__',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
    ...exclude
  ];

  // TODO: optimize
  return props.filter((item: string) => !excludeProps.includes(item));
}

/**
 * Check is object is empty.
 * For other types it will return true.
 * Null means an empty object too. Better is not to use null.
 */
export function isEmptyObject(obj: Record<any, any> | null | undefined): boolean {
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') return true

  return !Object.keys(obj || {}).length
}

/**
 * Make a new object which doesn't include specified keys
 */
export function omitObj(
  obj: Record<any, any> | null | undefined,
  ...keysToExclude: string[]
): Record<any, any> {
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') return {}

  const result: {[index: string]: any} = {};

  for (let key of Object.keys(obj)) {
    if (keysToExclude.indexOf(key) < 0) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * It creates a new object which doesn't include keys which values are undefined.
 */
export function omitUndefined(
  obj: {[index: string]: any} | null | undefined
): Record<any, any> {
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') return {}

  const result: {[index: string]: any} = {}

  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'undefined') continue

    result[key] = obj[key]
  }

  return result
}

/**
 * Create a new object which includes only specified keys
 */
export function pickObj(
  obj: Record<any, any> | null | undefined,
  ...keysToPick: string[]
): Record<any, any> {
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') return {}

  const result: Record<any, any> = {}

  for (let key of keysToPick) {
    result[key] = obj[key]
  }

  return result
}

/**
 * Find element in object. Like lodash's find function.
 */
export function findObj<T extends any>(
  obj: Record<any, any> | null | undefined,
  // TODO: откуда тут number ???
  cb: (item: any, index: string | number) => any
): T | undefined {
  if (obj === null || typeof obj === 'undefined') {
    return
  }
  else if (typeof obj !== 'object') {
    throw new Error(`findObj: unsupported type of object "${JSON.stringify(obj)}"`);
  }

  for (let key of Object.keys(obj)) {
    const result: any = cb(obj[key], key)

    if (result === false || typeof result === 'undefined') continue

    return obj[key]
  }
  // if not found then return undefined
  return
}

export function isPlainObject(obj: any): boolean {
  return obj // not null
    && typeof obj === 'object' // separate from primitives
    && obj.constructor === Object // separate instances (Array, DOM, ...)
    && Object.prototype.toString.call(obj) === '[object Object]' // separate build-in like Math
    || false;
}

/**
 * Get key by value
 * E.g getKeyOfObject({key1: 'value1'}, 'value1') - then it returns 'key1'
 */
export function getKeyOfObject(obj?: {[index: string]: any}, value?: any): string | undefined {
  if (!obj || typeof value === 'undefined') return;

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error(`objects.getKeyOfObject: obj param has to be an object!`);
  }

  for (let key of Object.keys(obj)) {
    if (obj[key] === value) return key;
  }

  return;
}

/**
 * Clear all the props in object.
 * It mutates the object.
 */
export function clearObject(obj: {[index: string]: any}) {
  for (let name of Object.keys(obj)) delete obj[name];
}

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

// TODO: test
export function collectObjValues(
  src: Record<any, any>,
  keyPath: string,
  skipUndefined: boolean = true
): Record<string, any> {
  const res: Record<string, any> = {}

  for (const key of Object.keys(src)) {
    const val = deepGet(src[key], keyPath)

    if (skipUndefined && typeof val === 'undefined') continue

    res[key] = val
  }

  return res
}

// TODO: test
export function collectEachObjValues(
  src: Record<any, any>,
  handler: (item: Record<any, any>, key: string) => any,
  skipUndefined: boolean = true
): Record<string, any> {
  const res: Record<string, any> = {}

  for (const key of Object.keys(src)) {
    const val = handler(src[key], key)

    if (skipUndefined && typeof val === 'undefined') continue

    res[key] = val
  }

  return res
}


// /**
//  * Compare 2 objects and collect keys whose VALUES are different (not equals to the same key in the sourceObj).
//  * PartialObj can omit some props of sourceObj
//  * getDifferentKeys({a:1, b:1, c:1}, {a:1, b:2}) => ['b']
//  */
// export function getDifferentKeys(sourceObj?: {[index: string]: any}, partialObj?: {[index: string]: any}): string[] {
//   if (!partialObj) {
//     return [];
//   }
//   else if (!sourceObj) {
//     return Object.keys(partialObj);
//   }
//
//   const diffKeys: string[] = [];
//
//   for (let key of Object.keys(sourceObj)) {
//     // T-O-D-O: желательно не делать глубокого сравнения
//     // T-O-D-O: может использовать конструкцию - key in obj
//     // T-O-D-O: don't use isEqual
//     if (typeof partialObj[key] !== 'undefined' && !isEqual(sourceObj[key], partialObj[key])) {
//       diffKeys.push(key);
//     }
//   }
//
//   return diffKeys;
// }

// /**
//  * Is an object (plain or instance of some class), not an array
//  */
// export function isExactlyObject(item: any): boolean {
//   return item && typeof item === 'object' && !Array.isArray(item) || false;
// }

// // it works properly but very expensive because of using of JSON.stringify -> JSON.parse.
// // !WARNING: undefined values which are obviously set in objects will be omitted
// // !WARNING: undefined values in arrays will be converted to null
// // WARNING!: expensive operation
// export function cloneDeep(value: any): any {
//   // not cloneable
//   if (
//     // T-O-D-O: don't use null
//     value === null
//     || typeof value === 'number'
//     || typeof value === 'undefined'
//     || typeof value === 'function'
//   ) {
//     return value;
//   }
//   if (typeof value === 'string') {
//     return '' + value;
//   }
//   else if (value instanceof Uint8Array) {
//     const oldArr: Uint8Array = value;
//     const newArr: Uint8Array = new Uint8Array(oldArr.length);
//
//     for (let index in oldArr) newArr[index] = value[index];
//
//     return newArr;
//   }
//   else if (isPlainObject(value) || Array.isArray(value)) {
//     // arrays or plain object. Don't support of class instances.
//     return JSON.parse(JSON.stringify(value));
//   }
//
//   throw new Error(`cloneDeep: unsupported type of value "${JSON.stringify(value)}"`);
// }




// export function isEmpty(toCheck: any): boolean {
//   if (typeof toCheck == 'undefined' || toCheck === null || toCheck === '') return true;
//   else if (Array.isArray(toCheck) && !toCheck.length) return true;
//   else if (typeof toCheck === 'object' && !Object.keys(toCheck).length) return true;
//
//   return false;
// }

// export function findIndexj(collection: any[] | {[index: string]: any}, cb: (item: any, index: string | number) => any): number | string {
//   if (typeof collection === 'undefined') {
//     return -1;
//   }
//   else if (Array.isArray(collection)) {
//     for (let index in collection) {
//       const result: any | undefined = cb(collection[index], parseInt(index));
//
//       if (result) return parseInt(index);
//     }
//   }
//   else if (typeof collection === 'object') {
//     for (let key of Object.keys(collection)) {
//       const result: any = cb(collection[key], key);
//
//       if (result) return key;
//     }
//   }
//   else {
//     throw new Error(`findIndexObj: unsupported type of collection "${JSON.stringify(collection)}"`);
//   }
//
//   return -1;
// }

// /**
//  * It works with common structures like
//  *     {
//  *       parent: {
//  *         prop: 'value'
//  *       }
//  *     }
//  * @param rootObject
//  * @param {function} cb - callback like (items, pathToItem) => {}.
//  *                        If it returns false it means don't go deeper.
//  */
// export function findRecursively(rootObject: object, cb: (item: any, itemPath: string) => boolean) {
//   const recursive = (obj: object, rootPath: string): object | undefined => {
//     return find(obj, (item: any, name: string | number): any => {
//       const itemPath = trim(`${rootPath}.${name}`, '.');
//       const cbResult = cb(item, itemPath);
//
//       if (typeof cbResult === 'undefined') {
//         // go deeper
//         return recursive(item, itemPath);
//       }
//       else if (cbResult === false) {
//         // don't go deeper
//         return;
//       }
//       else {
//         // found - stop search
//         //return cbResult;
//         return true;
//       }
//     });
//   };
//
//   return recursive(rootObject, '');
// }
//
