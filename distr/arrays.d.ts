export declare function fill(array: any[], value: any): any[];
export declare function lastItem(arr: any[]): any;
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
 * Remove item from array. E.g removeItemFromArray(['a', 'b', 'c'], 'b') => ['a', 'c']
 * It can remove all the found items
 *     removeItemFromArray(['a', 'b', 'c', 'b'], 'b', false) => ['a', 'c']
 * Or remove only the first found item:
 *     removeItemFromArray(['a', 'b', 'c', 'b'], 'b') => ['a', 'c', 'b']
 * It doesn't mutates an array, it just returns a new one.
 */
export declare function removeItemFromArray(arr: any[] | undefined, item: any, firstEntry?: boolean): any[];
/**
 * Concat arrays and remove duplicates
 */
export declare function concatUniqStrArrays(...arrays: string[][]): string[];
export declare function cloneDeepArray(arr?: any[]): any[];
export declare function stringArrayToNumber(arr: string[]): number[];
export declare function filterBlackList(allItems: string[], blackList?: string[]): string[];