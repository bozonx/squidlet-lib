/**
 * Are arrays equal.
 * If one of them not Array then it returns false.
 */
import {cloneDeepObject} from './deepObjects.js';


// shift when you calculates length
export const ARRAY_INDEX_SHIFT = 1


// TODO: test
/**
 * If it is not array - return false
 * If it is nudefied or null then it returns false
 * If it is an array then check its length
 * @param arr
 */
export function isEmptyArray(arr?: any): boolean {
  if (!Array.isArray(arr)) return false

  return !arr.length
}

// TODO: test - не нужно, есть же метод Array.fill()
// TODO: хотя можно этот сделать error safe
// TODO: можно добавить установку length
export function fill(array: any[], value: any): any[] {
  const result: any[] = [];

  for (let index in array) {
    array[index] = value;
  }

  return result;
}

// TODO: test
export function fillWithNumberIncrement(start: number, itemsNum: number): number[] {
  const result: number[] = []

  for (let i = start; i < start + itemsNum; i++) result.push(i)

  return result
}

// TODO: test
export function fullWithArray(
  toMutatedArray: any[],
  fromArray: any[],
  copyLength?: boolean
) {
  for (const index of fromArray) {
    toMutatedArray[index] = fromArray[index]
  }
  // setting of length will remove unused items of array
  if (copyLength) toMutatedArray.length = fromArray.length
}

export function lastItem(arr: any[]): any {
  return arr[arr.length - ARRAY_INDEX_SHIFT]
}

// TODO: test
export function arrayKeys(arr?: any[]): number[] {
  if (!Array.isArray(arr)) return []

  return arr.map((el, i) => i)
}

// TODO: test
export function isArrayIncludesIndex(arr?: any[], index?: number): boolean {
  if (!Array.isArray(arr) || typeof index !== 'number') return false

  return index >= 0 && index < arr.length
}

// TODO: test
export function isLastIndex(arr: any[], currentIndex: number | string): boolean {
  return (arr.length - ARRAY_INDEX_SHIFT) === Number(currentIndex)
}

export function compactUndefined(arr: any[]): any[] {
  return arr.filter((item) => typeof item !== 'undefined');
}

export function clearArray(arr: any[]): void {
  arr.splice(0, arr.length);
}

/**
 * Make new array with specified dimension.
 * If arr smaller than "count" then odd items will be empty
 * If arr bigger than "count" then odd items will be omitted
 */
export function makeSizedArray(arr: any[], count: number): any[] {
  const result: any[] = new Array(count);

  for (let i = 0; i < count; i++) result[i] = arr[i];

  return result;
}

// TODO: test
/**
 * Remove item from array in mutate way
 * @param arr
 * @param item
 */
export function spliceItem(arr: any[] | undefined, item: any) {
  if (!arr) return

  const itemIndex = arr.indexOf(item)

  if (itemIndex < 0) return

  arr.splice(itemIndex, 1)
}

/**
 * Remove item from array. E.g removeItemFromArray(['a', 'b', 'c'], 'b') => ['a', 'c']
 * It can remove all the found items
 *     removeItemFromArray(['a', 'b', 'c', 'b'], 'b', false) => ['a', 'c']
 * Or remove only the first found item:
 *     removeItemFromArray(['a', 'b', 'c', 'b'], 'b') => ['a', 'c', 'b']
 * It doesn't mutates an array, it just returns a new one.
 */
export function removeItemFromArray(arr: any[] | undefined, item: any, firstEntry: boolean = true): any[] {
  if (!Array.isArray(arr)) return []

  if (firstEntry) {
    const index: number = arr.indexOf(item);

    if (index < 0) return arr;

    const clonedArr = [...arr];

    clonedArr.splice(index, 1);

    return clonedArr;
  }
  else {
    return arr.filter((currentItem: any) => {
      return currentItem !== item;
    });
  }
}

// TODO: test
// TODO: может как-то оптимизировать???
export function removeSomeItemsFromArray(arr: any[] | undefined, items: any[]): any[] {
  if (!Array.isArray(arr) || !arr.length) return []
  else if (!Array.isArray(items) || !items.length) return [...arr]

  return arr.filter((currentItem: any) => {
    return !items.includes(currentItem)
  })
}

/**
 * Concat arrays and remove duplicates.
 * This is much faster than deduplicate
 */
export function concatUniqStrArrays(...arrays: string[][]): string[] {
  const result: {[index: string]: true} = {};

  for (const arr of arrays) {
    for (const value of arr) {
      result[value] = true;
    }
  }

  return Object.keys(result);
}

// TODO: test
export function deduplicate(arr?: any[]): any[] {
  if (!arr || !arr.length) return []

  const result: any[] = []

  for (const value of arr) {
    if (result.indexOf(value) === -1) result.push(value)
  }

  return result
}


// TODO: это чё за хуйн??? - используется в squidlet ServicesManager
/**
 * Make a new array which contains items which are different in samples.
 * Examples:
 * * [1,4], [1,2,3] => [4]
 * * [1,3], [1,2,3] => []
 * WARNING: be careful with choosing between testArr and samples
 * @param testArr - array to check, we not sure about it.
 * @param samples - means all the available values
 */
export function arraysDifference(testArr: any[], samples: any[]): any[] {
  if (typeof testArr === 'undefined' || !testArr.length) return [];
  else if (typeof samples === 'undefined' || !samples.length) return testArr;

  const diffArr: any[] = [];

  for (let item of testArr) {
    if (typeof item === 'undefined') continue;

    if (samples.indexOf(item) === -1) {
      diffArr.push(item);
    }
  }

  return diffArr;
}

// TODO: test
/**
 * Find similar items in arrays.
 * It is actually finds intersections
 * [1,2] => [2,3] => [2]
 * @param arrs
 */
export function arraySimilar(...arrs: any[][]): any[] {
  const allItems: any[] = arrs.flat()
  const res: any[] = []

  for (const item of allItems) {
    if (
      !res.includes(item)
      && allItems.filter((i) => i === item).length > 1
    ) res.push(item)
  }

  return res
}

// TODO: доделать test
// TODO: поидее можно просто сделать dedeplicate
/**
 * Remove keys which are duplicate each other and return only those
 * keys which are only ones
 */
export function arrayDifference(...arrs: any[][]) {
  const uniqueValues: any[] = []
  const valuesIntersections: number[] = []

  for (const arr of arrs) {
    if (!Array.isArray(arr)) continue

    for (const item of arr) {
      const resItemIndex = uniqueValues.indexOf(item)

      if (resItemIndex === -1) {
        // new value
        uniqueValues.push(item)

        valuesIntersections[uniqueValues.length - 1] = 1
      }
      else {
        // found duplicate
        valuesIntersections[resItemIndex] = valuesIntersections[resItemIndex] + 1
      }
    }
  }
  // select only those which have only one includes
  return uniqueValues.filter((item, index) => {
    if (valuesIntersections[index] === 1) return true
  })
}

export function cloneDeepArray(arr?: any[]): any[] {
  if (!arr) return [];

  const result: any[] = [];

  for (let item of arr) {
    if (Array.isArray(item)) {
      // go deeper
      result.push(cloneDeepArray(item));
    }
    else if (typeof item === 'object') {
      // clone object
      result.push(cloneDeepObject(item));
    }
    else {
      result.push(item);
    }
  }

  return result;
}

export function stringArrayToNumber(arr: string[]): number[] {
  return arr.map((item) => Number(item));
}

export function filterBlackList(allItems: string[], blackList: string[] = []): string[] {
  if (!blackList || !blackList.length) return allItems

  let whiteList: string[] = []

  // TODO: better to use kind of interception function
  for (let item of allItems) {
    if (!blackList.includes(item)) whiteList.push(item)
  }

  return whiteList
}

// TODO: test
/**
 * Get a new array without the first element
 * @param arr
 */
export function withoutFirstItem(arr?: any[]): any[] {
  if (!Array.isArray(arr) || !arr.length) return []

  const newArr = [...arr]

  newArr.shift()

  return newArr
}

// TODO: test
/**
 * Get a new array without the first element
 * @param arr
 */
export function withoutLastItem(arr?: any[]): any[] {
  if (!Array.isArray(arr) || !arr.length) return []

  const newArr = [...arr]

  newArr.pop()

  return newArr
}

// export function combineWhiteAndBlackLists(
//   allItems: string[],
//   whiteList: string[],
//   blackList: string[]
// ): string[] {
//   if (!whiteList.length && !blackList.length) return [];
//   // only white
//   if (whiteList.length && !blackList.length) {
//     // TODO: по хорошему нужно фильтрануть allItems
//     return whiteList;
//   }
//   // only black list
//   if (!whiteList.length && blackList.length) {
//     const result: string[] = [];
//     // TODO: better to use kind of interception function
//     for (let item of allItems) {
//       if (!blackList.includes(item)) result.push(item);
//     }
//
//     return result;
//   }
//
//   // and black and white - filter white list
//   const result: string[] = [];
//   // TODO: по хорошему нужно фильтрануть allItems
//   // TODO: better to use kind of interception function
//   for (let item of whiteList) {
//     if (!blackList.includes(item)) result.push(item);
//   }
//
//   return result;
// }

// /**
//  * Like lodash's compact. It removes undefined, null and '' from array.
//  * It make a new array.
//  */
// export function compactArray(arr: any[]): any[] {
//   const result: any[] = [];
//
//   for (let value of arr) {
//     // T-O-D-O: don't use null
//     if (typeof value !== 'undefined' && value !== null && value !== '') {
//       result.push(value);
//     }
//   }
//
//   return result;
// }

// /**
//  * Find index of array.
//  * Cb has to return boolean of undefined. If true then it means that item is found.
//  */
// export function findIndexArray(arr: any[], cb: (item: any, index: number) => boolean | undefined): number {
//   if (typeof arr === 'undefined') {
//     return -1;
//   }
//   else if (!Array.isArray(arr)) {
//     throw new Error(`findIndexArray: unsupported type of "arr" param "${JSON.stringify(arr)}"`);
//   }
//
//   for (let index in arr) {
//     const indexNum: number = parseInt(index);
//     const result: any | undefined = cb(arr[indexNum], indexNum);
//
//     if (result === false || typeof result === 'undefined') continue;
//
//     return indexNum;
//   }
//
//   return -1;
// }

// export function find(collection: any[] | {[index: string]: any}, cb: (item: any, index: string | number) => any): any | undefined {
//   if (typeof collection === 'undefined') {
//     return;
//   }
//   else if (Array.isArray(collection)) {
//     for (let index in collection) {
//       const result: any | undefined = cb(collection[index], parseInt(index));
//
//       if (result) return collection[index];
//     }
//   }
//   else if (typeof collection === 'object') {
//     for (let key of Object.keys(collection)) {
//       const result: any = cb(collection[key], key);
//
//       if (result) return collection[key];
//     }
//   }
//   else {
//     throw new Error(`find: unsupported type of collection "${JSON.stringify(collection)}"`);
//   }
//
//   return;
// }
