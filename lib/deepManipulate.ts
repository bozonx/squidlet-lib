import {trimCharStart} from './strings.js';
import {
  arrayKeys,
  cloneDeepArray, concatUniqStrArrays,
  deduplicate,
  isArrayIncludesIndex,
  lastItem,
  withoutFirstItem,
  withoutLastItem
} from './arrays.js';
import {cloneDeepObject} from './deepObjects.js';
import {isPlainObject} from './objects.js';


const DEEP_PATH_SEPARATOR = '.'
export const DONT_GO_DEEPER = Symbol('DONT_GO_DEEPER')


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
 * Or return itself if path is only one element.
 * Be careful if path points to array then array will be returned
 * @param src - object or array where to find parent
 * @param pathTo - full path to parameter of parent
 * @param strict - if true then it will check does key exist in parent
 * @return - [parent, paramKey, parentPath]
 */
export function deepGetParent(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  strict: boolean = false
): [any, string | number, string] | [] {
  if (!src || (!Array.isArray(src) && typeof src !== 'object')) return []
  else if (typeof pathTo !== 'string' || !pathTo) return []

  const splatPath = splitDeepPath(pathTo)
  const parentPath = joinDeepPath(withoutLastItem(splatPath))
  const paramKey: string | number | undefined = lastItem(splatPath)
  // if can't find anything. But it shouldn't be
  if (typeof paramKey === 'undefined') return []

  const parent = (parentPath)
    // get parent
    ? deepGet(src, parentPath)
    // use src
    : src

  if (!parent) return []

  if (strict) {
    if (Array.isArray(parent) && Number(paramKey) >= parent.length) return []
    else if (
      typeof parent === 'object' && !Object.keys(parent).includes(String(paramKey))
    ) {
      return []
    }
  }

  return [parent, paramKey, parentPath || '']
}

export function deepHas(src?: Record<any, any> | Record<any, any>[], pathTo?: string): boolean {
  const [ , paramKey] = deepGetParent(src, pathTo, true)

  return typeof paramKey !== 'undefined'
}

/**
 * Set value deeply.
 * If path does not exist then it will create objects and arrays according this path
 * If value is undefined then the undefined will be set
 * @param src
 * @param pathTo
 * @param value
 */
export function deepSet(src?: any | any[], pathTo?: string, value?: any): boolean {
  if (!src || (!Array.isArray(src) && typeof src !== 'object')) return false
  else if (typeof pathTo !== 'string' || !pathTo) return false

  const splatPath = splitDeepPath(pathTo)
  const currentKey: string | number | undefined = splatPath[0]
  // something went wrong in this case
  if (typeof currentKey === 'undefined') return false

  if (splatPath.length > 1) {
    // has child
    const childPath = joinDeepPath(withoutFirstItem(splatPath))

    if (typeof src[currentKey] === 'undefined') {
      src[currentKey] = (typeof splatPath[1] === 'number') ? [] : {}
    }
    // go deeper
    return deepSet(src[currentKey], childPath, value)
  }
  // else this is the plain root - just set value
  src[currentKey] = value

  return true
}

/**
 * It will delete item from object or array.
 * In case of array instead of item will be undefined.
 * @param src
 * @param pathTo
 */
export function deepDelete(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
): boolean {
  const [parent, lastPathPart] = deepGetParent(src, pathTo, true)
  // it can be object or array
  if (parent && typeof lastPathPart !== 'undefined') {
    delete parent[lastPathPart]

    return true
  }

  return false
}

export function deepClone(src?: any): any {
  if (Array.isArray(src)) {
    return cloneDeepArray(src)
  }
  else if (typeof src === 'object') {
    return cloneDeepObject(src)
  }

  return src
}

/**
 * Find object by checking its properties
 * @param src
 * @param handler
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export function deepFindObj(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (obj: Record<any, any>, key: string | number, path: string) => (any | undefined),
  initialPath?: string,
  onlyPlainObjects: boolean = true
): Record<any, any> | undefined {
  if (!handler || !src || (!Array.isArray(src) && typeof src !== 'object')) return

  const keys: (string | number)[] = (Array.isArray(src))
    ? arrayKeys(src)
    : Object.keys(src)

  for (const key of keys) {
    const item = (src as any)[key]
    const path = joinDeepPath([initialPath, key])

    // skip class instances in case of onlyPlainObjects
    if (onlyPlainObjects && !isPlainObject(item)) continue

    const res = handler(item, key, path)
    // if it shouldn't go deeper than continue
    if (res === DONT_GO_DEEPER) continue
    // if found
    else if (res) return item
    // else go deeper to each key of object
    else {
      const deepRes = deepFindObj(item, handler, path)

      if (deepRes) return deepRes
    }
  }
}

// TODO: как это объединить с deepFindObj ???
/**
 * Find object by checking its properties.
 * @param src
 * @param handler,
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export async function deepFindObjAsync(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (obj: Record<any, any>, key: string | number, path: string) => (any | undefined),
  initialPath?: string,
  onlyPlainObjects: boolean = true
): Promise<Record<any, any> | undefined> {
  if (!handler || !src || (!Array.isArray(src) && typeof src !== 'object')) return

  const keys: (string | number)[] = (Array.isArray(src))
    ? arrayKeys(src)
    : Object.keys(src)

  for (const key of keys) {
    const item = (src as any)[key]
    const path = joinDeepPath([initialPath, key])

    // skip class instances in case of onlyPlainObjects
    if (onlyPlainObjects && !isPlainObject(item)) continue

    const res = await handler(item, key, path)
    // if it shouldn't go deeper than continue
    if (res === DONT_GO_DEEPER) continue
    // if found
    else if (res) return item
    // else go deeper to each key of object
    else {
      const deepRes = await deepFindObjAsync(item, handler, path)

      if (deepRes) return deepRes
    }
  }
}

/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export function deepEachObj(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (obj: Record<any, any>, key: string | number, path: string) => void,
  initialPath?: string,
  onlyPlainObjects: boolean = true
): void {
  deepFindObj(src, handler, initialPath, onlyPlainObjects)
}

/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export async function deepEachObjAsync(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (obj: Record<any, any>, key: string | number, path: string) => void,
  initialPath?: string,
  onlyPlainObjects: boolean = true
) {
  await deepFindObjAsync(src, handler, initialPath, onlyPlainObjects)
}

export function isSameDeep(obj1?: any, obj2?: any): boolean {

  // TODO: поддержка массивов

  if (obj1 === obj2) return true
  else if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
  else if (!Object.keys(obj1).length) return false
  else if (Object.keys(obj1).length !== Object.keys(obj2).length) return false

  for (const [key, value] of Object.entries(obj1)) {
    // TODO: use isPlainObject
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

// TODO: test
// TODO: optimize
/**
 * Merge 2 values with can be a simple value or object or array.
 * Keep in mind that it doesn't go into class instances.
 * If top is simple value of class instance then top will be get
 * If top and bottom are arrays or plain objects then they will be merged
 *   with priority ob top
 * If top and bottom have different types then top will be get
 * @param top value of this object will overwrite the bottom value
 * @param bottom value of this object will be overwritten by top value
 */
export function deepMerge(
  top: any | any[],
  bottom: any | any[]
): any | any[] {
  if (Array.isArray(top) && Array.isArray(bottom)) {
    // do merge if both values are arrays
    const length = Math.max(bottom.length, top.length)
    // go deeper into each item of both arrays
    return new Array(length).fill(false)
      .map((val, index) => deepMerge(top[index], bottom[index]))
  }
  else if (isPlainObject(top) && isPlainObject(bottom)) {
    // do merge if both values are objects
    const topKeys = Object.keys(top)

    // TODO: тут смешается порядок ключей - может можно более тонко сделать чем sort

    const keys = concatUniqStrArrays(topKeys, Object.keys(bottom)).sort()
    const result: Record<any, any> = {}

    for (const key of keys) {
      // we use includes here to  overwrite undefined values in top
      result[key] = (topKeys.includes(key)) ? top[key] : bottom[key]
    }

    return result
  }
  // else if values aren't arrays and objects then try to get top value otherwise bottom
  return (typeof top === 'undefined') ? bottom : top
}
