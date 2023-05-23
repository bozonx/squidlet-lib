export declare function deepGet(src?: Record<any, any> | Record<any, any>[], pathTo?: string, defaultValue?: any): any;
export declare function deepSet(src?: Record<any, any> | Record<any, any>[], pathTo?: string, value?: any): any;
export declare function deepDelete(src?: Record<any, any> | Record<any, any>[], pathTo?: string): any;
export declare function deepClone(src?: any): any;
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
