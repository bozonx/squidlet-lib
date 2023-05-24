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
export declare function joinDeepPath(pathParts?: (string | number)[]): string;
/**
 * Get value deeply from object or array.
 * @param src - object or array
 * @param pathTo - path like obj.arr[0].param
 * @param defaultValue - value which will be returned in case value not found
 */
export declare function deepGet(src?: Record<any, any> | Record<any, any>[], pathTo?: string, defaultValue?: any): any;
export declare function deepHas(src?: Record<any, any> | Record<any, any>[], pathTo?: string): boolean;
export declare function deepSet(src?: Record<any, any> | Record<any, any>[], pathTo?: string, value?: any): void;
export declare function deepDelete(src?: Record<any, any> | Record<any, any>[], pathTo?: string): any;
export declare function deepClone(src?: any): any;
