import { concatUint8Arr, int32ToUint8Arr, uint8ToNum } from './binaryHelpers.js';
const BIN_MARK = '!BIN!';
const UNDEFINED_MARK = '!UNDEF!';
const BIN_LENGTH_SEP = ':';
// TODO: check test
export function base64ToString(str) {
    if (typeof btoa === 'undefined') {
        return Buffer.from(str).toString('base64');
    }
    return btoa(str);
}
// TODO: check test
export function stringToBase64(base64Str) {
    if (typeof atob === 'undefined') {
        return Buffer.from(base64Str, 'base64').toString();
    }
    return atob(base64Str);
}
// TODO: test
export function uint8ArrayToAscii(uintArray) {
    return String.fromCharCode.apply(undefined, uintArray);
}
// TODO: test
export function asciiToUint8Array(str) {
    if (!str)
        return new Uint8Array(0);
    const charList = str.split('');
    const uintArray = [];
    for (let i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
}
// TODO: check test
// see https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
export function uint8ArrayToUtf8Text(uintArray) {
    // TODO: use uint8ArrayToAscii
    const encodedString = String.fromCharCode.apply(undefined, uintArray);
    return decodeURIComponent(escape(stringToBase64(encodedString)));
    // var uint8array = new TextEncoder("utf-8").encode("Plain Text");
    // var string = new TextDecoder().decode(uint8array);
    // console.log(uint8array ,string )
}
// TODO: check test
export function utf8TextToUint8Array(str) {
    const string = base64ToString(unescape(encodeURIComponent(str)));
    // TODO: use asciiToUint8Array
    const charList = string.split('');
    const uintArray = [];
    for (let i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
}
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
export function serializeJson(data) {
    let binDataTail = new Uint8Array();
    const stringMsg = JSON.stringify(data, (key, value) => {
        if (value instanceof Uint8Array) {
            const start = binDataTail.length;
            const length = value.length;
            binDataTail = concatUint8Arr(binDataTail, value);
            return BIN_MARK + start + BIN_LENGTH_SEP + length;
        }
        else if (typeof value === 'undefined') {
            return UNDEFINED_MARK;
        }
        return value;
    });
    const jsonBin = utf8TextToUint8Array(stringMsg);
    // 4 bytes of json binary length
    const jsonLengthBin = int32ToUint8Arr(jsonBin.length);
    return concatUint8Arr(jsonLengthBin, jsonBin, binDataTail);
}
/**
 * Convert previously serialized json which mights content binary data
 * to js object as it was before serialization.
 */
export function deserializeJson(serialized) {
    if (!(serialized instanceof Uint8Array)) {
        throw new Error(`deserializeJson: serialized data has to be a Uint8Array`);
    }
    const binJsonLength = serialized.subarray(0, 4);
    const jsonLength = uint8ToNum(binJsonLength);
    // 4 is 4 bytes of length 32 bit number
    const jsonBin = serialized.subarray(4, 4 + jsonLength);
    const jsonString = uint8ArrayToUtf8Text(jsonBin);
    const binaryTail = serialized.subarray(4 + jsonLength);
    return JSON.parse(jsonString, (key, value) => {
        if (typeof value === 'string' && value.indexOf(BIN_MARK) === 0) {
            const payload = value.split(BIN_MARK)[1];
            const splat = payload.split(BIN_LENGTH_SEP);
            const start = Number(splat[0]);
            const length = Number(splat[1]);
            return binaryTail.subarray(start, start + length);
        }
        else if (typeof value === 'string' && value.indexOf(UNDEFINED_MARK) === 0) {
            return undefined;
        }
        return value;
    });
}
// TODO: test
export function serializeStringArray(arr, lengthBytes = 1) {
    if (lengthBytes !== 1)
        throw new Error(`Bigger length than 1 byte isn't supported`);
    const result = [];
    for (let item of arr) {
        // TODO: проверить длину элемента массива
        result.push(item.length);
        result.push(...asciiToUint8Array(item));
    }
    return new Uint8Array(result);
}
// TODO: test
// TODO: use deserializeUint8Array
/**
 * Make array from Uint8Array which was encoded by serializeStringArray
 * and return the last index
 * @param data
 * @param startIndex
 * @param count
 */
export function deserializeStringArray(data, startIndex, count) {
    const result = [];
    let i;
    for (i = startIndex; i < data.length; i++) {
        const itemLength = data[i];
        const itemData = data.slice(i + 1, i + itemLength + 1);
        result.push(uint8ArrayToAscii(itemData));
        i = i + itemLength;
        if (result.length >= count)
            break;
    }
    return [result, i];
}
// TODO: test
export function deserializeUint8Array(data, startIndex = 0, count) {
    const resolvedCount = (typeof count === 'undefined') ? data.length : count;
    const result = [];
    let i;
    for (i = startIndex; i < data.length; i++) {
        const itemLength = data[i];
        if (!itemLength)
            break;
        const itemData = data.slice(i + 1, i + itemLength + 1);
        result.push(itemData);
        i = i + itemLength;
        if (result.length >= resolvedCount)
            break;
    }
    return { arrays: result, lastElementIndex: i };
}
