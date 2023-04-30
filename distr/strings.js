export function trimCharStart(src, char = ' ') {
    if (typeof src !== 'string')
        return src;
    let countToCut = 0;
    for (let i = 0; i < src.length; i++) {
        if (src[i] === char) {
            countToCut++;
        }
        else {
            break;
        }
    }
    return src.slice(countToCut);
}
export function trimCharEnd(src, char = ' ') {
    if (typeof src !== 'string')
        return src;
    let countToCut = 0;
    for (let i = src.length - 1; i >= 0; i--) {
        if (src[i] === char) {
            countToCut--;
        }
        else {
            break;
        }
    }
    if (!countToCut)
        return src;
    return src.slice(0, countToCut);
}
export function trimChar(src, char = ' ') {
    return trimCharEnd(trimCharStart(src, char), char);
}
/**
 * Turn only the first letter to upper case
 */
export function firstLetterToUpperCase(value) {
    if (!value)
        return value;
    const split = value.split('');
    split[0] = split[0].toUpperCase();
    return split.join('');
}
/**
 * Split first element of path using separator. 'path/to/dest' => [ 'path', 'to/dest' ]
 */
export function splitFirstElement(fullPath, separator) {
    if (!fullPath)
        throw new Error(`fullPath param is required`);
    if (!separator)
        throw new Error(`separator is required`);
    const split = fullPath.split(separator);
    const first = split[0];
    if (split.length === 1) {
        return [fullPath, undefined];
    }
    return [first, split.slice(1).join(separator)];
}
/**
 * Split last part of path. 'path/to/dest' => [ 'dest', 'path/to' ]
 */
export function splitLastElement(fullPath, separator) {
    if (!fullPath)
        throw new Error(`fullPath param is required`);
    if (!separator)
        throw new Error(`separator is required`);
    const split = fullPath.split(separator);
    const last = split[split.length - 1];
    if (split.length === 1) {
        return [fullPath, undefined];
    }
    // remove last element from path
    split.pop();
    return [last, split.join(separator)];
}
export function padStart(srcString, length = 0, chars = ' ') {
    let result = '';
    const repeats = length - srcString.length;
    if (repeats <= 0)
        return srcString;
    for (let i = 0; i < repeats; i++)
        result += chars;
    return `${result}${srcString}`;
    // const filled: string[] = new Array(repeats);
    //
    // return `${filled.fill(chars).join('')}${srcString}`;
}
