import { trimCharStart } from './strings'
import {
  arrayKeys,
  cloneDeepArray,
  concatUniqStrArrays,
  isArrayIncludesIndex,
  lastItem,
  withoutFirstItem,
  withoutLastItem,
} from './arrays'
import { cloneDeepObject } from './deepObjects'
import { isPlainObject } from './objects'

const DEEP_PATH_SEPARATOR = '.'
export const DONT_GO_DEEPER = Symbol('DONT_GO_DEEPER')

/**
 * Split deep path to paths E.g "aa[0].bb[1].cc" => ['aa', 0, 'bb', 1, 'cc']
 *
 * @param pathTo
 */
export function splitDeepPath(pathTo?: string): (string | number)[] {
  if (!pathTo || typeof pathTo !== 'string') return []

  const res: (string | number)[] = []
  const preparedPath = pathTo.replace(/\[/g, DEEP_PATH_SEPARATOR + '[')
  const splatDots = trimCharStart(preparedPath, DEEP_PATH_SEPARATOR).split(
    DEEP_PATH_SEPARATOR
  )

  splatDots.forEach((el: string) => {
    if (el.indexOf('[') === 0) {
      // it is only array index - [0]
      const match = el.match(/\d+/)
      if (match && match[0]) {
        const index: number = Number(match[0])
        res.push(index)
      } else {
        // Если не удалось извлечь индекс, пропускаем этот элемент
        // или можно добавить обработку ошибки
        console.warn(`Invalid array index format: ${el}`)
      }
    } else {
      // only key as string
      res.push(el)
    }
  })

  return res
}

/**
 * Join deep path parts to string E.g ['aa', 0, 'bb', 1, 'cc'] =>
 * "aa[0].bb[1].cc"
 *
 * @param pathParts
 */
export function joinDeepPath(
  pathParts?: (string | number | undefined)[]
): string {
  if (!Array.isArray(pathParts) || !pathParts.length) return ''

  let result = ''

  for (const item of pathParts) {
    if (typeof item === 'number') {
      result += `[${item}]`
    } else if (typeof item === 'string' && item) {
      result += DEEP_PATH_SEPARATOR + item
    } else {
      // if empty string or undefined - do nothing
    }
  }

  return trimCharStart(result, DEEP_PATH_SEPARATOR)
}

/**
 * Get value deeply from object or array.
 *
 * @param src - Object or array
 * @param pathTo - Path like obj.arr[0].param
 * @param defaultValue - Value which will be returned in case value not found
 */
export function deepGet(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  defaultValue?: any
): any {
  // Проверяем на null и undefined
  if (src === null || src === undefined) return defaultValue
  else if (typeof pathTo !== 'string') return defaultValue

  const splatPath = splitDeepPath(pathTo)
  const restPath = joinDeepPath(withoutFirstItem(splatPath))

  if (Array.isArray(src)) {
    // means wrong path
    if (typeof splatPath[0] !== 'number') return defaultValue

    const arrIndex: number = splatPath[0]

    if (restPath) {
      // go deeper - проверяем на null перед рекурсивным вызовом
      const nextValue = src[arrIndex]
      if (nextValue === null || nextValue === undefined) return defaultValue
      return deepGet(nextValue, restPath, defaultValue)
    } else {
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
      // go deeper - проверяем на null перед рекурсивным вызовом
      const nextValue = src[currentKey]
      if (nextValue === null || nextValue === undefined) return defaultValue
      return deepGet(nextValue, restPath, defaultValue)
    } else {
      // found final value
      if (Reflect.ownKeys(src).includes(currentKey)) {
        return src[currentKey]
      }
      // not found a key
      return defaultValue
    }
  } else {
    // if it isn't object or array then just return defaultValue or undefined
    return defaultValue
  }
}

/**
 * Get parent if path is deep. Or return itself if path is only one element. Be
 * careful if path points to array then array will be returned
 *
 * @param src - Object or array where to find parent
 * @param pathTo - Full path to parameter of parent
 * @param strict - If true then it will check does key exist in parent
 * @returns - [parent, paramKey, parentPath]
 */
export function deepGetParent(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  strict: boolean = false
): [any, string | number, string] | [] {
  // Проверяем на null и undefined
  if (
    src === null ||
    src === undefined ||
    (!Array.isArray(src) && typeof src !== 'object')
  )
    return []
  else if (typeof pathTo !== 'string' || !pathTo) return []

  const splatPath = splitDeepPath(pathTo)
  const parentPath = joinDeepPath(withoutLastItem(splatPath))
  const paramKey: string | number | undefined = lastItem(splatPath)
  // if can't find anything. But it shouldn't be
  if (typeof paramKey === 'undefined') return []

  const parent = parentPath
    ? // get parent
      deepGet(src, parentPath)
    : // use src
      src

  // Проверяем на null и undefined
  if (parent === null || parent === undefined) return []

  if (strict) {
    if (Array.isArray(parent) && Number(paramKey) >= parent.length) return []
    else if (
      typeof parent === 'object' &&
      !Object.keys(parent).includes(String(paramKey))
    ) {
      return []
    }
  }

  return [parent, paramKey, parentPath || '']
}

export function deepHas(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string
): boolean {
  const [, paramKey] = deepGetParent(src, pathTo, true)

  return typeof paramKey !== 'undefined'
}

/**
 * Set value deeply. If path does not exist then it will create objects and
 * arrays according this path If value is undefined then the undefined will be
 * set
 *
 * @param src
 * @param pathTo
 * @param value
 */
export function deepSet(
  src?: any | any[],
  pathTo?: string,
  value?: any
): boolean {
  // Проверяем на null и undefined
  if (
    src === null ||
    src === undefined ||
    (!Array.isArray(src) && typeof src !== 'object')
  )
    return false
  else if (typeof pathTo !== 'string' || !pathTo) return false

  const splatPath = splitDeepPath(pathTo)
  const currentKey: string | number | undefined = splatPath[0]
  // something went wrong in this case
  if (typeof currentKey === 'undefined') return false

  if (splatPath.length > 1) {
    // has child
    const childPath = joinDeepPath(withoutFirstItem(splatPath))

    if (typeof src[currentKey] === 'undefined') {
      src[currentKey] = typeof splatPath[1] === 'number' ? [] : {}
    }
    // go deeper
    return deepSet(src[currentKey], childPath, value)
  }
  // else this is the plain root - just set value
  src[currentKey] = value

  return true
}

/**
 * It will delete item from object or array. In case of array instead of item
 * will be undefined.
 *
 * @param src
 * @param pathTo
 */
export function deepDelete(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string
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
  // Проверяем на null и undefined
  if (src === null || src === undefined) return src

  if (Array.isArray(src)) {
    return cloneDeepArray(src)
  } else if (typeof src === 'object') {
    return cloneDeepObject(src)
  }

  return src
}

/**
 * Find object by checking its properties
 *
 * @param src
 * @param handler
 * @param initialPath - Path to the object in src
 * @param onlyPlainObjects - Default is true. It means skip class instances and
 *   process only plain objects
 */
export function deepFindObj<T = Record<any, any>>(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (
    obj: Record<any, any>,
    key: string | number,
    path: string
  ) => any | undefined,
  initialPath?: string,
  onlyPlainObjects: boolean = true
): T | undefined {
  // Проверяем на null и undefined
  if (
    !handler ||
    src === null ||
    src === undefined ||
    (!Array.isArray(src) && typeof src !== 'object')
  )
    return

  const keys: (string | number)[] = Array.isArray(src)
    ? arrayKeys(src)
    : Object.keys(src)

  for (const key of keys) {
    const item = (src as any)[key]
    const path = joinDeepPath([initialPath, key])

    if (Array.isArray(item)) {
      const deepRes = deepFindObj(item, handler, path)

      if (deepRes) return deepRes

      continue
    }
    // skip non objects values
    else if (typeof item !== 'object' || !item) continue
    // skip class instances in case of onlyPlainObjects
    else if (onlyPlainObjects && !isPlainObject(item)) continue
    // run handler to check if we found the item
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
 *
 * @param src
 * @param handler
 * @param initialPath - Path to the object in src
 * @param onlyPlainObjects - Default is true. It means skip class instances and
 *   process only plain objects
 */
export async function deepFindObjAsync<T = Record<any, any>>(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (
    obj: Record<any, any>,
    key: string | number,
    path: string
  ) => any | undefined,
  initialPath?: string,
  onlyPlainObjects: boolean = true
): Promise<T | undefined> {
  // Проверяем на null и undefined
  if (
    !handler ||
    src === null ||
    src === undefined ||
    (!Array.isArray(src) && typeof src !== 'object')
  )
    return

  const keys: (string | number)[] = Array.isArray(src)
    ? arrayKeys(src)
    : Object.keys(src)

  for (const key of keys) {
    const item = (src as any)[key]
    const path = joinDeepPath([initialPath, key])

    if (Array.isArray(item)) {
      const deepRes = await deepFindObjAsync(item, handler, path)

      if (deepRes) return deepRes

      continue
    }
    // skip non objects values
    else if (typeof item !== 'object' || !item) continue
    // skip class instances in case of onlyPlainObjects
    else if (onlyPlainObjects && !isPlainObject(item)) continue
    // run handler to check if we found the item
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
 *
 * @param src
 * @param handler - If returns true-like then the cycle will break
 * @param initialPath - Path to the object in src
 * @param onlyPlainObjects - Default is true. It means skip class instances and
 *   process only plain objects
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
 *
 * @param src
 * @param handler - If returns true-like then the cycle will break
 * @param initialPath - Path to the object in src
 * @param onlyPlainObjects - Default is true. It means skip class instances and
 *   process only plain objects
 */
export async function deepEachObjAsync(
  src?: Record<any, any> | Record<any, any>[],
  handler?: (obj: Record<any, any>, key: string | number, path: string) => void,
  initialPath?: string,
  onlyPlainObjects: boolean = true
) {
  await deepFindObjAsync(src, handler, initialPath, onlyPlainObjects)
}

/**
 * Merge 2 values with can be a simple value or object or array. Keep in mind
 * that it doesn't go into class instances - they will be copied from top. Also
 * keep in mind that order of keys in objects will be bottom first, after them
 * are top keys In array top will always replace bottom keys including undefined
 * ones Be careful with undefined - in arrays and objects it will be gotten from
 * top, but if it is a top is undefined then bottom will be gotten. If top is
 * simple value of class instance then top will be get If top and bottom are
 * arrays or plain objects then they will be merged with priority ob top If top
 * and bottom have different types then top will be get
 *
 * @param top Value of this object will overwrite the bottom value
 * @param bottom Value of this object will be overwritten by top value
 */
export function deepMerge(top: any | any[], bottom: any | any[]): any | any[] {
  // Проверяем на null и undefined
  if (top === null || top === undefined) return bottom
  if (bottom === null || bottom === undefined) return top

  if (Array.isArray(top) && Array.isArray(bottom)) {
    // do merge if both values are arrays
    const length = Math.max(bottom.length, top.length)
    const res: any[] = []

    for (let i = 0; i < length; i++) {
      let resolvedValue: any | undefined

      if (i > top.length - 1) {
        resolvedValue = bottom[i]
      } else if (typeof top[i] !== 'undefined') {
        // else top is defined do merge of top and bottom items
        resolvedValue = deepMerge(top[i], bottom[i])
      }
      // else if top value is explicitly undefined then set undefined

      res.push(resolvedValue)
    }

    return res
  } else if (isPlainObject(top) && isPlainObject(bottom)) {
    // do merge if both values are objects
    const topKeys = Object.keys(top)
    const keys = concatUniqStrArrays(Object.keys(bottom), topKeys)
    const result: Record<any, any> = {}

    for (const key of keys) {
      // implicitly replace value with undefined
      if (typeof top[key] === 'undefined' && topKeys.includes(key))
        result[key] = undefined
      // else do merge two objects
      else result[key] = deepMerge(top[key], bottom[key])
    }

    return result
  }
  // else if values aren't arrays and objects then try to get top value otherwise bottom
  return typeof top === 'undefined' ? bottom : top
}

/**
 * Check two items. Try to find at least one difference
 *
 * - If they are some simple values then just compare them
 * - If they are class instances - compare if they are the same instance
 * - If they are arrays - compare arrays deeply
 * - If they are objects - compare objects deeply
 *
 * @param some1
 * @param some2
 */
export function isSameDeep(some1?: any, some2?: any): boolean {
  // Проверяем на null и undefined
  if (some1 === null && some2 === null) return true
  if (some1 === undefined && some2 === undefined) return true
  if (some1 === null || some2 === null) return false
  if (some1 === undefined || some2 === undefined) return false

  if (Array.isArray(some1) && Array.isArray(some2)) {
    // check arrays
    if (!some1.length && !some2.length) return true
    else if (some1.length !== some2.length) return false
    // count of keys the same
    for (const key of some1.keys()) {
      const res = isSameDeep(some1[key], some2[key])
      // if false - we found the difference. else go further
      if (!res) return false
    }

    return true
  } else if (isPlainObject(some1) && isPlainObject(some2)) {
    // check plain objects
    const keys1 = Object.keys(some1)
    const keys2 = Object.keys(some2)

    if (!keys1.length && !keys2.length) return true
    else if (keys1.length !== keys2.length) return false
    // count of keys the same
    for (const key of keys1) {
      const res = isSameDeep(some1[key], some2[key])
      // if false - we found the difference. else go further
      if (!res) return false
    }

    return true
  } else if (Number.isNaN(some1) && Number.isNaN(some2)) return true
  // check simple types and class instances
  return some1 === some2
}

/**
 * Get value of given keyName from any deep objects
 *
 * @param src
 * @param keyName
 */
export function deepGetObjValue(
  src?: Record<any, any> | Record<any, any>[],
  keyName?: string
): any {
  // Проверяем на null и undefined
  if (!keyName || src === null || src === undefined) return

  const resObj = deepFindObj(
    src,
    (obj: Record<any, any>, key: string | number, path: string) => {
      if (Object.keys(obj).includes(keyName)) return true
    }
  )

  return resObj && resObj[keyName]
}
