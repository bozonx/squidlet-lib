/**
 * Merges two objects deeply.
 * It doesn't mutate any object.
 * If you obviously set undefined to one of top's param - it will removes this key from the result object.
 * Arrays will be cloned.
 * It clones the top object.
 */
export declare function mergeDeepObjects<T = Record<string, any>>(top?: Record<string, any>, bottom?: Record<string, any>): T;
/**
 * Clone object deeply.
 */
export declare function cloneDeepObject<T = Record<string, any>>(obj?: {
    [index: string]: any;
}): T;
/**
 * Sort keys of object recursively.
 * Arrays won't be sorted.
 */
export declare function sortObject(preObj: Record<string, any>): Record<string, any>;
