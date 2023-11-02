export declare function base64ToString(str: string): string;
export declare function stringToBase64(base64Str: string): string;
export declare function uint8ArrayToAscii(uintArray: Uint8Array): string;
export declare function asciiToUint8Array(str: string): Uint8Array;
export declare function uint8ArrayToUtf8Text(uintArray: Uint8Array): string;
export declare function utf8TextToUint8Array(str: string): Uint8Array;
/**
 * Extract binary data from json and put in to the tail.
 * Result will be [
 *   4 bytes of json length,
 *   binary json,
 *   binary data from json
 * ]
 * WARNING: undefined keys of objects will be omitted.
 * WARNING: undefined values of array will be empty.
 */
export declare function serializeJson(data: any): Uint8Array;
/**
 * Convert previously serialized json which mights content binary data
 * to js object as it was before serialization.
 */
export declare function deserializeJson(serialized: Uint8Array | any): any;
export declare function serializeStringArray(arr: string[], lengthBytes?: number): Uint8Array;
/**
 * Make array from Uint8Array which was encoded by serializeStringArray
 * and return the last index
 * @param data
 * @param startIndex
 * @param count
 */
export declare function deserializeStringArray(data: Uint8Array, startIndex: number, count: number): [string[], number];
export declare function deserializeUint8Array(data: Uint8Array, startIndex?: number, count?: number): {
    arrays: Uint8Array[];
    lastElementIndex: number;
};
