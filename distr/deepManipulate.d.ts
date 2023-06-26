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
 * Or return itself if path is only one element
 * @param src
 * @param pathTo
 */
export declare function deepGetParent(src?: Record<any, any> | Record<any, any>[], pathTo?: string): [any, string | number] | [];
export declare function deepHas(src?: Record<any, any> | Record<any, any>[], pathTo?: string): boolean;
export declare function deepSet(src?: Record<any, any> | Record<any, any>[], pathTo?: string, value?: any): boolean;
export declare function deepDelete(src?: Record<any, any> | Record<any, any>[], pathTo?: string): any;
export declare function deepClone(src?: any): any;
/**
 * Find object by checking its properties
 * @param src
 * @param handler
 * @param initialPath - path to the object in src
 */
export declare function deepFindObj(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => (any | undefined), initialPath?: string): Record<any, any> | undefined;
/**
 * Find object by checking its properties
 * @param src
 * @param handler,
 * @param initialPath - path to the object in src
 */
export declare function deepFindObjAsync(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => (any | undefined), initialPath?: string): Promise<Record<any, any> | undefined>;
/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 */
export declare function deepEachObj(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => void, initialPath?: string): void;
/**
 * Run handler on each object in arrays or other objects
 * @param src
 * @param handler - if returns true-like then the cycle will break
 * @param initialPath - path to the object in src
 */
export declare function deepEachObjAsync(src?: Record<any, any> | Record<any, any>[], handler?: (obj: Record<any, any>, key: string | number, path: string) => void, initialPath?: string): Promise<void>;
export declare function isSameDeep(obj1?: any, obj2?: any): boolean;
