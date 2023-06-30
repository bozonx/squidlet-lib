export declare const ARRAY_INDEX_SHIFT = 1;
/**
 * If it is not array - return false
 * If it is nudefied or null then it returns false
 * If it is an array then check its length
 * @param arr
 */
export declare function isEmptyArray(arr?: any[]): boolean;
export declare function fill(array: any[], value: any): any[];
export declare function fullWithArray(toMutatedArray: any[], fromArray: any[], copyLength?: boolean): void;
export declare function lastItem(arr: any[]): any;
export declare function arrayKeys(arr?: any[]): number[];
export declare function isArrayIncludesIndex(arr?: any[], index?: number): boolean;
export declare function isLastIndex(arr: any[], currentIndex: number | string): boolean;
/**
 * Make a new array which contains items which are different in samples.
 * Examples:
 * * [1,4], [1,2,3] => [4]
 * * [1,3], [1,2,3] => []
 * WARNING: be careful with choosing between testArr and samples
 * @param testArr - array to check, we not sure about it.
 * @param samples - means all the available values
 */
export declare function arraysDifference(testArr: any[], samples: any[]): any[];
export declare function compactUndefined(arr: any[]): any[];
export declare function clearArray(arr: any[]): void;
/**
 * Make new array with specified dimension.
 * If arr smaller than "count" then odd items will be empty
 * If arr bigger than "count" then odd items will be omitted
 */
export declare function makeSizedArray(arr: any[], count: number): any[];
/**
 * Remove item from array in mutate way
 * @param arr
 * @param item
 */
export declare function spliceItem(arr: any[] | undefined, item: any): void;
/**
 * Remove item from array. E.g removeItemFromArray(['a', 'b', 'c'], 'b') => ['a', 'c']
 * It can remove all the found items
 *     removeItemFromArray(['a', 'b', 'c', 'b'], 'b', false) => ['a', 'c']
 * Or remove only the first found item:
 *     removeItemFromArray(['a', 'b', 'c', 'b'], 'b') => ['a', 'c', 'b']
 * It doesn't mutates an array, it just returns a new one.
 */
export declare function removeItemFromArray(arr: any[] | undefined, item: any, firstEntry?: boolean): any[];
export declare function removeSomeItemsFromArray(arr: any[] | undefined, items: any[]): any[];
/**
 * Concat arrays and remove duplicates.
 * This is much faster than concatUniqArrays
 */
export declare function concatUniqStrArrays(...arrays: string[][]): string[];
export declare function deduplicate(arr?: any[]): any[];
export declare function cloneDeepArray(arr?: any[]): any[];
export declare function stringArrayToNumber(arr: string[]): number[];
export declare function filterBlackList(allItems: string[], blackList?: string[]): string[];
/**
 * Get a new array without the first element
 * @param arr
 */
export declare function withoutFirstItem(arr?: any[]): any[];
/**
 * Get a new array without the first element
 * @param arr
 */
export declare function withoutLastItem(arr?: any[]): any[];
