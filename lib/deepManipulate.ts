import {splitFirstElement, trimCharStart} from './strings.js';


const DEEP_PATH_SEPARATOR = '.'

// TODO: cloneDeep - может быть как массив, так и объект


export function deepGet(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  defaultValue?: any
): any {
  if (!src || !pathTo) return defaultValue

  if (Array.isArray(src)) {
    const match = pathTo.match(/^\[(\d+)\](.*)$/)
    // means wrong path
    if (!match || !match[1]) return defaultValue

    const arrIndex = Number(match[1])
    const restPath = trimCharStart(match[2], DEEP_PATH_SEPARATOR)

    if (restPath) {
      // go deeper
      return deepGet(src[arrIndex], restPath, defaultValue)
    }
    else {
      // found final value
      return src[arrIndex]
    }
  }
  else if (typeof src === 'object') {
    const arrMatch = pathTo.match(/^([^.]+)\[/)
    let currentKey: string
    let restPath: string | undefined

    if (arrMatch) {
      currentKey = arrMatch[1]
      restPath = pathTo.split(currentKey)[1]
    }
    else {
      [currentKey, restPath] = splitFirstElement(pathTo, DEEP_PATH_SEPARATOR)
    }

    if (!currentKey) {
      return defaultValue
    }
    else if (!restPath) {
      // found final value
      return src[currentKey]
    }
    else {
      // go deeper
      return deepGet(src[currentKey], restPath, defaultValue)
    }
  }
  else {
    // if it isn't object or array then just return defaultValue or undefined
    return defaultValue
  }
}

export function deepSet(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
  value?: any
): any {

}

export function deepDelete(
  src?: Record<any, any> | Record<any, any>[],
  pathTo?: string,
): any {
  //const [child, pathToParent] = splitLastElement(path, '.')

  // TODO: взять родителя и у него удалить потомка
  // TODO: поддержка массивов

}

export function deepClone(src?: any): any {

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
