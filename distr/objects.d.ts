/**
 * Get all the class members include prototype's exclude "constructor".
 */
export declare function getAllTheClassMembers(obj: Object, exclude?: string[]): string[];
/**
 * Check is object is empty.
 * For other types it will return true.
 * Null means an empty object too. Better is not to use null.
 */
export declare function isEmptyObject(obj: Record<any, any> | null | undefined): boolean;
/**
 * Make a new object which doesn't include specified keys
 */
export declare function omitObj(obj: Record<any, any> | null | undefined, ...keysToExclude: string[]): Record<any, any>;
/**
 * It creates a new object which doesn't include keys which values are undefined.
 */
export declare function omitUndefined(obj: {
    [index: string]: any;
} | null | undefined): Record<any, any>;
/**
 * Create a new object which includes only specified keys
 */
export declare function pickObj(obj: Record<any, any> | null | undefined, ...keysToPick: string[]): Record<any, any>;
/**
 * Find element in object. Like lodash's find function.
 */
export declare function findObj<T extends any>(obj: Record<any, any> | null | undefined, cb: (item: any, index: string) => any): T | undefined;
export declare function isPlainObject(obj: any): boolean;
/**
 * Get the first key of value
 * E.g getKeyOfObject({key1: 'value1'}, 'value1') - then it returns 'key1'
 */
export declare function getKeyOfObject(obj?: Record<any, any>, value?: any): string | undefined;
/**
 * Clear all the props in object.
 * It mutates the object.
 */
export declare function clearObject(obj: {
    [index: string]: any;
}): void;
export declare function collectObjValues(src: Record<any, any>, keyPath: string, skipUndefined?: boolean): Record<string, any>;
export declare function collectEachObjValues(src: Record<any, any>, handler: (item: Record<any, any>, key: string) => any, skipUndefined?: boolean): Record<string, any>;
export declare function getClassPublicMembers(obj?: any): string[];
