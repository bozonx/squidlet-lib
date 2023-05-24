import {splitFirstElement, splitLastElement, trimCharStart} from './strings.js';
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
  const splatDots = pathTo.split(DEEP_PATH_SEPARATOR)

  splatDots.forEach((el: string) => {
    if (el.indexOf('[') === 0) {
      // it is only array index - [0]
      const index: number = Number(el.match(/\d+/)![0])

      res.push(index)
    }
    else if (el.indexOf('[') > 0) {
      // it is like "key[0]"
      const matched = el.match(/^([^\[]+)\[(\d+)/)

      res.push(matched![1])
      res.push(Number(matched![2]))
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
export function joinDeepPath(pathParts?: (string | number)[]): string {
  if (!Array.isArray(pathParts) || !pathParts.length) return ''

  let result = ''

  for (const item of pathParts) {
    if (typeof item === 'number') {
      result += `[${item}]`
    }
    else {
      // string
      result += DEEP_PATH_SEPARATOR + item
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
      if (Object.keys(src).includes(currentKey)) {
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

export function deepHas(src?: Record<any, any> | Record<any, any>[], pathTo?: string): boolean {

  // TODO: check keys

  return true
}

export function deepSet(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  value?: any
) {
  if (!src || (!Array.isArray(src) && typeof src !== 'object')) return
  else if (typeof pathTo !== 'string' || !pathTo) return

  const splatPath = splitDeepPath(pathTo)
  const prevPath = joinDeepPath(withoutLastItem(splatPath))
  const lastPathPart: string | number | undefined = lastItem(splatPath)
  // if can't find anything. But it shouldn't be
  if (typeof lastPathPart === 'undefined') return

  const lastPathStr: string = joinDeepPath([lastPathPart])

  //const lastArrMatch = pathTo.match(/^(.*)\[(\d+)\]$/)
  //let prevPath: string | undefined
  //let lastElIndex: number | undefined
  //let lastPath: string | undefined

  // if (lastArrMatch) {
  //   // the last element is array's item
  //   lastElIndex = Number(lastArrMatch[2])
  //   // prev path or '' if no prev path
  //   prevPath = lastArrMatch[1] || undefined
  //   lastPath = `[${lastElIndex}]`
  // }
  // else {
  //   // the last element is object's item
  //   const res = splitLastElement(
  //     pathTo,
  //     DEEP_PATH_SEPARATOR
  //   )
  //
  //   lastPath = res[0]
  //   prevPath = res[1]
  // }


  if (prevPath) {
    // get the parent and set value to it
    const parent = deepGet(src, prevPath)

    if (!parent) return
    // TODO: а зачем???
    //deepSet(parent, lastPathStr, value)
    (parent as any)[lastPathPart] = value
  }
  else {
    // means set value to src
    (src as any)[lastPathPart] = value

    // if (Array.isArray(src) && typeof lastPathPart === 'number') {
    //   src[lastPathPart] = value
    // }
    // else if (typeof src === 'object') {
    //   (src as any)[lastPathPart] = value
    // }
  }
}

export function deepDelete(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
): any {
  //const [child, pathToParent] = splitLastElement(path, '.')

  // TODO: взять родителя и у него удалить потомка
  // TODO: поддержка массивов

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
