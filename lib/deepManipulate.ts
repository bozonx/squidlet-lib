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
