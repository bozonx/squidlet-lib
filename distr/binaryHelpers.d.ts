/**
 * Are uint8 arrays equal.
 * If one of them not Uint8Array then it returns false.
 */
export declare function isEqualUint8Array(first?: Uint8Array, second?: Uint8Array): boolean;
/**
 * Better to use "keys" method which returned a iterator.
 * But it isn't supported on lowjs.
 */
export declare function uint8ArrayKeys(arr: Uint8Array): number[];
/**
 * Make a new Uint8Array without the first item
 */
export declare function withoutFirstItemUint8Arr(arr: Uint8Array): Uint8Array;
/**
 * Make a new Uint8Array with the new item on the first position and other items are moved right
 */
export declare function addFirstItemUint8Arr(arr: Uint8Array, itemToAdd: number): Uint8Array;
export declare function stringToUint8Array(str: string): Uint8Array;
/**
 * Converts hex like "ffff" to array of bytes [ 255, 255 ]
 */
export declare function hexStringToUint8Arr(hex: string): Uint8Array;
/**
 * converts uint [ 255, 255 ] to 'ffff'
 */
export declare function uint8ArrToHexString(bytesArr: Uint8Array): string;
/**
 * e.g 65535 => "ffff". To decode use - hexStringToHexNum() or parseInt("ffff", 16)
 */
export declare function int16ToHexString(hexNum: number): string;
/**
 * to hex. eg - "5A" -> 90. "5a" the same.
 * undefined -> 0
 */
export declare function hexStringToHexNum(hexString: string | number | undefined): number;
export declare function hexNumToString(hexNum?: number): string;
/**
 * Normalize hex string value
 * * "2f" => '0x2f'
 * * "f" => '0x0f'
 * * "0x2f" => '0x2f'
 */
export declare function normalizeHexString(value: string | number): string;
/**
 * Converts byte as a number (255) to binary string "11111111", (4 > "00000100").
 * Number are always 8.
 */
export declare function byteToString(hexValue: number): string;
/**
 * Converts byte as number (255) to binary array
 * [true, true, true, true, true, true, true, true], (4 > [false, false, false, false, false, true, false, false]).
 * Numbers are always 8.
 */
export declare function byteToBinArr(hexValue: number): boolean[];
/**
 * Convert 65535 to "ffff", 1 to "0001".
 * Result is always 4 chars
 */
export declare function numToWord(num: number): string;
/**
 * Converts 65535 > [ 255, 255 ], 1 > [ 0, 1 ]
 */
export declare function numToUint8Word(num: number): Uint8Array;
/**
 * You have to pass a uint8Arr with 2, 4, or 8 length to convert:
 * [ 255, 255 ] > 65535,
 * [ 0, 1 ] > 1
 * [ 255, 255, 255, 255 ] >  4294967295
 */
export declare function uint8ToNum(uint8Arr: Uint8Array): number;
/**
 * Converts [65535, 0] => [255,255, 0, 0]
 */
export declare function uint16ToUint8(arr16: Uint16Array): Uint8Array;
/**
 * Converts [255,255, 0, 0] => [65535, 0]
 */
export declare function uint8ToUint16(arr8: Uint8Array): Uint16Array;
/**
 * Make hex string from 32 bit number (0 - 4294967295).
 * It always returns 8 characters.
 * 4294967295 > "ffffffff"
 * 65535 > "0000ffff"
 * 0 > "00000000"
 */
export declare function int32ToHexString(int32: number): string;
/**
 * It make uint8 array with 4 items.
 * 4294967295 > [255, 255, 255, 255]
 */
export declare function int32ToUint8Arr(int32: number): Uint8Array;
/**
 * Converts [true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false] > [255,0]
 * To be sure that array of bits have strict length use helpers.makeSizedArray()
 */
export declare function bitsToBytes(bits: (boolean | undefined)[]): Uint8Array;
/**
 * Converts [255,0] > [true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false]
 */
export declare function bytesToBits(bytes: Uint8Array | number[]): boolean[];
/**
 * Update specific position in bitmask.
 * E.g updateBitInByte(0, 2, true) ===> 4 (00000100)
 * @param byte
 * @param position - from 0 to 7
 * @param value
 */
export declare function updateBitInByte(byte: number, position: number, value: boolean): number;
/**
 * Get bit on specific position from byte (as number)
 */
export declare function getBitFromByte(byte: number, position: number): boolean;
/**
 * convert simple number to ascii number. 1 > 49
 */
export declare function getAsciiNumber(num: number): number;
export declare function concatUint8Arr(...arrs: Uint8Array[]): Uint8Array;
/**
 * Make 1 byte from 2 4-bit number.
 */
export declare function combine2numberToByte(one: number, two: number): number;
/**
 * Extract 2 4-bit numbers from byte which has been encoded by `combine2numberToByte`
 */
export declare function extract2NumbersFromByte(byte: number): [number, number];
/**
 * Get number of octet.
 * Octet number starts from 0.
 * bitNum starts from 0
 * * bitNum = 0 returns 0
 * * bitNum = 7 returns 0
 * * bitNum = 8 returns 1
 * * bitNum = 25 returns 3
 */
export declare function getOctetNum(bitNum: number): number;
/**
 * How many octets needs for specified bits count.
 * Octet number starts from 1.
 * bitNum starts from 1.
 * * bitNum = 1 returns 1
 * * bitNum = 8 returns 1
 * * bitNum = 9 returns 2
 * * bitNum = 25 returns 4
 */
export declare function howManyOctets(bitCount: number): number;
/**
 * Get bit number in one octet even bit number points to not the first octet
 * * bitNum = 0 returns 0
 * * bitNum = 7 returns 7
 * * bitNum = 8 returns 0
 * * bitNum = 9 returns 1
 * @param bitNum
 */
export declare function getBitNumInOctet(bitNum: number): number;
