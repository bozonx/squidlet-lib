import {trimCharStart} from './strings.js';
import {cloneDeepArray, isArrayIncludesIndex, lastItem, withoutFirstItem, withoutLastItem} from './arrays.js';
import {cloneDeepObject} from './deepObjects.js';


const DEEP_PATH_SEPARATOR = '.'


/**
 * Split deep path to paths
 * E.g "aa[0].bb[1].cc" => ['aa', 0, 'bb', 1, 'cc']
 * @param pathTo
 */
export function splitDeepPath(pathTo?: string): (string | number)[] {
  if (!pathTo || typeof pathTo !== 'string') return []

  const res: (string | number)[] = []
  const preparedPath = pathTo.replace(
    /\[/g,
    DEEP_PATH_SEPARATOR + '['
  )
  const splatDots = trimCharStart(preparedPath, DEEP_PATH_SEPARATOR)
    .split(DEEP_PATH_SEPARATOR)

  splatDots.forEach((el: string) => {
    if (el.indexOf('[') === 0) {
      // it is only array index - [0]
      const index: number = Number(el.match(/\d+/)![0])

      res.push(index)
    }
    else {
      // only key as string
      res.push(el)
    }
  })

  return res
}

/**
 * Join deep path parts to string
 * E.g ['aa', 0, 'bb', 1, 'cc'] => "aa[0].bb[1].cc"
 * @param pathParts
 */
export function joinDeepPath(pathParts?: (string | number | undefined)[]): string {
  if (!Array.isArray(pathParts) || !pathParts.length) return ''

  let result = ''

  for (const item of pathParts) {
    if (typeof item === 'number') {
      result += `[${item}]`
    }
    else if (typeof item === 'string' && item) {
      result += DEEP_PATH_SEPARATOR + item
    }
    else {
      // if empty string or undefined - do nothing
    }
  }

  return trimCharStart(result, DEEP_PATH_SEPARATOR)
}

/**
 * Get value deeply from object or array.
 * @param src - object or array
 * @param pathTo - path like obj.arr[0].param
 * @param defaultValue - value which will be returned in case value not found
 */
export function deepGet(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  defaultValue?: any
): any {
  if (typeof src === 'undefined') return defaultValue
  else if (typeof pathTo !== 'string') return defaultValue

  const splatPath = splitDeepPath(pathTo)
  const restPath = joinDeepPath(withoutFirstItem(splatPath))

  // TODO: а проверка массива разве сработает на прокси???
  if (Array.isArray(src)) {
    // means wrong path
    if (typeof splatPath[0] !== 'number') return defaultValue

    const arrIndex: number = splatPath[0]

    if (restPath) {
      // go deeper
      return deepGet(src[arrIndex], restPath, defaultValue)
    }
    else {
      // found final value
      if (isArrayIncludesIndex(src, arrIndex)) {
        return src[arrIndex]
      }

      return defaultValue
    }
  }
  // not null and object
  else if (src && typeof src === 'object') {
    // if not string that means wrong path - return default value
    if (typeof splatPath[0] !== 'string') return defaultValue

    let currentKey: string = splatPath[0]

    if (restPath) {
      // go deeper
      return deepGet(src[currentKey], restPath, defaultValue)
    }
    else {
      // found final value
      if (Reflect.ownKeys(src).includes(currentKey)) {
        return src[currentKey]
      }
      // not found a key
      return defaultValue
    }
  }
  else {
    // if it isn't object or array then just return defaultValue or undefined
    return defaultValue
  }
}

/**
 * Get parent if path is deep.
 * Or return itself if path is only one element
 * @param src
 * @param pathTo
 */
export function deepGetParent(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
): [any, string | number] | [] {
  if (!src || (!Array.isArray(src) && typeof src !== 'object')) return []
  else if (typeof pathTo !== 'string' || !pathTo) return []

  const splatPath = splitDeepPath(pathTo)
  const prevPath = joinDeepPath(withoutLastItem(splatPath))
  const lastPathPart: string | number | undefined = lastItem(splatPath)
  // if can't find anything. But it shouldn't be
  if (typeof lastPathPart === 'undefined') return []

  const parent = (prevPath)
    // get parent
    ? deepGet(src, prevPath)
    // use src
    : src

  return [parent, lastPathPart]
}

export function deepHas(src?: Record<any, any> | Record<any, any>[], pathTo?: string): boolean {
  if (!src || (!Array.isArray(src) && typeof src !== 'object')) return false
  else if (typeof pathTo !== 'string' || !pathTo) return false

  const splatPath = splitDeepPath(pathTo)
  const prevPath = joinDeepPath(withoutLastItem(splatPath))
  const lastPathPart: string | number | undefined = lastItem(splatPath)
  // if can't find anything. But it shouldn't be
  if (typeof lastPathPart === 'undefined') return false

  const elToCheck: any = (prevPath)
    // get parent
    ? deepGet(src, prevPath)
    // use src
    : src

  if (Array.isArray(elToCheck) && typeof lastPathPart === 'number') {
    if (lastPathPart < 0) return false

    return lastPathPart < elToCheck.length
  }
  else if (typeof elToCheck === 'object' && typeof lastPathPart === 'string') {
    const keys = Reflect.ownKeys(elToCheck)

    return keys.includes(lastPathPart)
  }

  return false
}

export function deepSet(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  value?: any
): boolean {
  const [parent, lastPathPart] = deepGetParent(src, pathTo)

  // it can be object or array
  if (parent && typeof lastPathPart !==  'undefined') {
    parent[lastPathPart] = value

    return true
  }

  return false
}

// TODO: test
export function deepDelete(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
): any {
  const [parent, lastPathPart] = deepGetParent(src, pathTo)
  // it can be object or array
  if (parent && typeof lastPathPart !==  'undefined') delete parent[lastPathPart]
}

// TODO: test
export function deepClone(src?: any): any {
  if (Array.isArray(src)) {
    return cloneDeepArray(src)
  }
  else if (typeof src === 'object') {
    return cloneDeepObject(src)
  }

  return src
}

// TODO: test
// TODO: add path to handler
/**
 * Find object by checking its properties
 * @param src
 * @param handler
 */
export function deepFindObj(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (obj: Record<any, any>, key: string | number) => (any | undefined)
): Record<any, any> | undefined {
  if (!handler || !src || (!Array.isArray(src) && typeof src !== 'object')) return

  if (Array.isArray(src)) {
    // go deep to each item of array
    for (const item of src) {
      const res = deepFindObj(item, handler)

      if (res) return res
    }
  }
  else {
    // object
    for (const key of Object.keys(src)) {
      const res = handler(src[key], key)
      // if found
      if (res) return src[key]
      // else go deeper to each key of object
      else {
        const deepRes = deepFindObj(src[key], handler)

        if (deepRes) return deepRes
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
 */
export function deepEachObj(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (obj: Record<any, any>, key: string | number) => void
): void {
  deepFindObj(src, handler)
}

export function isSameDeep(obj1?: any, obj2?: any): boolean {

  // TODO: поддержка массивов

  if (obj1 === obj2) return true
  else if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
  else if (!Object.keys(obj1).length) return false
  else if (Object.keys(obj1).length !== Object.keys(obj2).length) return false

  for (const [key, value] of Object.entries(obj1)) {
    if (value && typeof value === 'object' && typeof obj2[key] === 'object') {
      const res = isSameDeep(value, obj2[key])

      if (!res) return false
      // if true then continue
    }
    else {
      if (obj1[key] !== obj2[key]) return false
      // the just continue
    }
  }

  return true
}

// TODO: add find both arrays and objects
// TODO: add deep foreach


// TODO: remake
// function splitDeepPathOOOLD(pathTo: string): {arrIndex?: number, objKey?: string, restPath?: string} {
//   const arrMatch = pathTo.match(/^\[(\d+)\](.*)$/)
//   // try to recognize an array path
//   if (arrMatch && arrMatch[1]) {
//     return {
//       arrIndex: Number(arrMatch[1]),
//       objKey: undefined,
//       restPath: trimCharStart(arrMatch[2], DEEP_PATH_SEPARATOR),
//     }
//   }
//
//   const [objKey, restPath] = splitFirstElement(pathTo, DEEP_PATH_SEPARATOR)
//
//   return {
//     arrIndex: undefined,
//     objKey,
//     restPath,
//   }
// }

// TODO: test
// TODO: не особо нужно, так как не работает с массивами
// /**
//  * Set value deeply to object and create nodes if need.
//  * It mutates the object
//  * @param obj
//  * @param pathTo - path like parnent.node1.node2
//  * @param value
//  */
// export function objSetMutate(obj: Record<string, any>, pathTo: string, value: any) {
//   const pathSplat: string[] = pathTo.split('.')
//   let currentDir = obj
//
//   for (const index in pathSplat) {
//     const curDirName = pathSplat[index]
//
//     if (Number(index) === pathSplat.length - 1) {
//       // the last element
//       currentDir[curDirName] = value
//     }
//     else {
//       // in the middle
//       // create dir if not exist
//       if (!currentDir[curDirName]) {
//         currentDir[curDirName] = {}
//         currentDir = currentDir[curDirName]
//       }
//     }
//   }
// }


// /**
//  * Get value from deep object.
//  * If there isn't a value or node undefined or default value will be returned.
//  * WARNING: arrays doesn't supported!
//  */
// export function objGet(obj?: {[index: string]: any}, pathTo?: string, defaultValue?: any): any {
//   if (!obj || !pathTo) return defaultValue;
//
//   const recursive = (currentObj: {[index: string]: any}, currentPath: string): any => {
//     for (let itemName of Object.keys(currentObj)) {
//       const pathOfItem: string = (currentPath) ? [currentPath, itemName].join('.') : itemName;
//
//       if (pathTo.indexOf(pathOfItem) !== 0) {
//         // lost path
//         return;
//       }
//       else if (pathOfItem === pathTo) {
//         // found
//         return currentObj[itemName];
//       }
//       else if (Array.isArray(currentObj[itemName])) {
//         // arrays aren't supported
//         return;
//       }
//       // got deeper
//       else if (typeof currentObj[itemName] === 'object') {
//         return recursive(currentObj[itemName], pathOfItem);
//       }
//
//       // else do nothing
//     }
//   };
//
//   const result: any = recursive(obj, '');
//
//   if (typeof result === 'undefined' && typeof defaultValue !== 'undefined') return defaultValue;
//
//   return result;
// }
