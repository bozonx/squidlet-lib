/**
 * Get all the class members include prototype's exclude "constructor".
 */
export declare function getAllTheClassMembers(obj: Object, exclude?: string[]): string[];
/**
 * Check is object is empty.
 * For other types it will return true.
 * Null means an empty object too. Better is not to use null.
 */
export declare function isEmptyObject(toCheck?: {
    [index: string]: any;
}): boolean;
/**
 * Make a new object which doesn't include specified keys
 */
export declare function omitObj(obj: {
    [index: string]: any;
} | null | undefined, ...keysToExclude: string[]): {
    [index: string]: any;
};
/**
 * It creates a new object which doesn't include keys which values are undefined.
 */
export declare function omitUndefined(obj: {
    [index: string]: any;
} | undefined): {
    [index: string]: any;
};
/**
 * Create a new object which includes only specified keys
 */
export declare function pickObj(obj: {
    [index: string]: any;
} | undefined, ...keysToPick: string[]): {
    [index: string]: any;
};
/**
 * Find element in object. Like lodash's find function.
 */
export declare function findObj<T extends any>(obj: {
    [index: string]: any;
}, cb: (item: any, index: string | number) => any): T | undefined;
export declare function isPlainObject(obj: any): boolean;
/**
 * Get key by value
 * E.g getKeyOfObject({key1: 'value1'}, 'value1') - then it returns 'key1'
 */
export declare function getKeyOfObject(obj?: {
    [index: string]: any;
}, value?: any): string | undefined;
/**
 * Clear all the props in object.
 * It mutates the object.
 */
export declare function clearObject(obj: {
    [index: string]: any;
}): void;
/**
 * Merges two objects deeply.
 * It doesn't mutate any object.
 * If you obviously set undefined to one of top's param - it will removes this key from the result object.
 * Arrays will be cloned.
 */
export declare function mergeDeepObjects<T = Record<string, any>>(top?: Record<string, any>, bottom?: Record<string, any>): T;
/**
 * Clone object deeply.
 */
export declare function cloneDeepObject<T = Record<string, any>>(obj?: {
    [index: string]: any;
}): T;
/**
 * Get value from deep object.
 * If there isn't a value or node undefined or default value will be returned.
 * WARNING: arrays doesn't supported!
 */
export declare function objGet(obj?: {
    [index: string]: any;
}, pathTo?: string, defaultValue?: any): any;
/**
 * Set value deeply to object and create nodes if need.
 * It mutates the object
 * @param obj
 * @param pathTo - path like parnent.node1.node2
 * @param value
 */
export declare function objSetMutate(obj: Record<string, any>, pathTo: string, value: any): void;
/**
 * Sort keys of object recursively.
 * Arrays won't be sorted.
 */
export declare function sortObject(preObj: Record<string, any>): Record<string, any>;
