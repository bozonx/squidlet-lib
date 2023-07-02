export declare const DONT_GO_DEEPER: unique symbol;
/**
 * Split deep path to paths
 * E.g "aa[0].bb[1].cc" => ['aa', 0, 'bb', 1, 'cc']
 * @param pathTo
 */
export declare function splitDeepPath(pathTo?: string): (string | number)[];
/**
 * Join deep path parts to string
 * E.g ['aa', 0, 'bb', 1, 'cc'] => "aa[0].bb[1].cc"
 * @param pathParts
 */
export declare function joinDeepPath(pathParts?: (string | number | undefined)[]): string;
/**
 * Get value deeply from object or array.
 * @param src - object or array
 * @param pathTo - path like obj.arr[0].param
 * @param defaultValue - value which will be returned in case value not found
 */
export declare function deepGet(src?: Record<any, any> | Record<any, any>[], pathTo?: string, defaultValue?: any): any;
/**
 * Get parent if path is deep.
 * Or return itself if path is only one element.
 * Be careful if path points to array then array will be returned
 * @param src - object or array where to find parent
 * @param pathTo - full path to parameter of parent
 * @param strict - if true then it will check does key exist in parent
 * @return - [parent, paramKey, parentPath]
 */
export declare function deepGetParent(src?: Record<any, any> | Record<any, any>[], pathTo?: string, strict?: boolean): [any, string | number, string] | [];
export declare function deepHas(src?: Record<any, any> | Record<any, any>[], pathTo?: string): boolean;
export declare function deepSet(src?: Record<any, any> | Record<any, any>[], pathTo?: string, value?: any): boolean;
/**
 * It will delete item from object or array.
 * In case of array instead of item will be undefined.
 * @param src
 * @param pathTo
 */
export declare function deepDelete(src?: Record<any, any> | Record<any, any>[], pathTo?: string): boolean;
export declare function deepClone(src?: any): any;
/**
 * Find object by checking its properties
 * @param src
 * @param handler
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export declare function deepFindObj(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => (any | undefined), initialPath?: string, onlyPlainObjects?: boolean): Record<any, any> | undefined;
/**
 * Find object by checking its properties.
 * @param src
 * @param handler,
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export declare function deepFindObjAsync(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => (any | undefined), initialPath?: string, onlyPlainObjects?: boolean): Promise<Record<any, any> | undefined>;
/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export declare function deepEachObj(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => void, initialPath?: string, onlyPlainObjects?: boolean): void;
/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 * @param onlyPlainObjects - default is true. It means skip class instances and
 *                           process only plain objects
 */
export declare function deepEachObjAsync(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => void, initialPath?: string, onlyPlainObjects?: boolean): Promise<void>;
export declare function isSameDeep(obj1?: any, obj2?: any): boolean;
/**
 * Merge 2 values with can be a simple value or object or array.
 * Keep in mind that it doesn't go into class instances.
 * If top is simple value of class instance then top will be get
 * If top and bottom are arrays or plain objects then they will be merged
 *   with priority ob top
 * If top and bottom have different types then top will be get
 * @param top value of this object will overwrite the bottom value
 * @param bottom value of this object will be overwritten by top value
 */
export declare function deepMerge(top: any | any[], bottom: any | any[]): any | any[];
