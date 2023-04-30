import { trimChar, trimCharEnd, trimCharStart } from './strings.js';
export const PATH_SEP = '/';
/**
 * Join paths.
 * pathJoin('/path/', '/to/', './dir') => '/path/to/./dir'.
 * It clears doubling of delimiters
 */
export function pathJoin(...paths) {
    const prepared = [];
    for (let i = 0; i < paths.length; i++) {
        let cleared;
        if (typeof paths[i] !== 'string') {
            throw new Error(`pathJoin: paths have to be strings`);
        }
        else if (i === 0) {
            // the first one - clear right delimiter
            cleared = trimCharEnd(paths[i], PATH_SEP);
        }
        else if (i === (paths.length - 1)) {
            // the right one - clear left delimiter
            cleared = trimCharStart(paths[i], PATH_SEP);
        }
        else {
            // in the middle - clear both delimiters
            cleared = trimChar(paths[i], PATH_SEP);
        }
        prepared.push(cleared);
    }
    return prepared
        .filter((item) => Boolean(item))
        .join(PATH_SEP);
}
export function pathIsAbsolute(pathToDirOrFile) {
    if (typeof pathToDirOrFile !== 'string') {
        throw new Error(`pathIsAbsolute: path has to be a string`);
    }
    return pathToDirOrFile.indexOf('/') === 0 || pathToDirOrFile.indexOf('~') === 0;
}
export function pathDirname(pathToDirOrFile) {
    const pathParts = trimCharEnd(pathToDirOrFile, PATH_SEP).split(PATH_SEP);
    pathParts.pop();
    return pathParts.join(PATH_SEP);
}
export function pathBasename(pathToDirOrFile) {
    const pathParts = pathToDirOrFile.split(PATH_SEP);
    return pathParts[pathParts.length - 1];
}
export function clearRelPathLeft(rawPath) {
    return rawPath.replace(/^[\s.\\~\/]*/, '');
}
export function pathTrimExt(fileName) {
    if (fileName.indexOf('.') < 0)
        return fileName;
    const splat = fileName.split('.');
    splat.pop();
    return splat.join('.');
}
export function replaceExt(fileName, newExt) {
    return `${pathTrimExt(fileName)}.${trimCharStart(newExt, '.')}`;
}