/**
 * Generate unique number.
 * It increments a counter on each call.
 * Counter is initialized with a random value.
 */
export declare function makeUniqNumber(): number;
/**
 * It returns id of runtime. This id is generating on first call of this function.
 * This id will never changed while runtime.
 * It contains of 8 chars.
 */
export declare function getRuntimeId(): string;
/**
 * Make always a unique id which contains of 8 chars.
 */
export declare function makeUniqId(bytes?: number): string;
