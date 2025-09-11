import {trimChar, trimCharEnd, trimCharStart} from './strings';


export const PATH_SEP = '/';


// TODO: test - если первый аргемент '/'
/**
 * Join paths.
 * pathJoin('/path/', '/to/', './dir') => '/path/to/./dir'.
 * It clears doubling of delimiters
 */
export function pathJoin (...paths: string[]): string {
  const prepared: string[] = []

  for (let i = 0; i < paths.length; i++) {

    if (typeof paths[i] !== 'string') {
      throw new Error(`pathJoin: paths have to be strings`);
    }

    prepared.push(paths[i])

    if (i < paths.length - 1) {
      // not last
      if (paths[i] !== PATH_SEP) prepared.push(PATH_SEP)
    }

    //let cleared: string = paths[i]
    // else if (i === 0) {
    //   // the first one - clear right delimiter
    //   cleared = trimCharEnd(paths[i], PATH_SEP)
    // }
    // else if (i === (paths.length -1)) {
    //   // the right one - clear left delimiter
    //   cleared = trimCharStart(paths[i], PATH_SEP)
    // }
    // else {
    //   // in the middle - clear both delimiters
    //   cleared = trimChar(paths[i], PATH_SEP)
    // }
    //prepared.push(cleared)
  }

  return prepared.join('')
}

export function pathIsAbsolute(pathToDirOrFile: string): boolean {
  if (typeof pathToDirOrFile !== "string") {
    throw new Error(`pathIsAbsolute: path has to be a string`);
  }

  // TODO: support ~/

  return (
    pathToDirOrFile.indexOf("/") === 0 || pathToDirOrFile.indexOf("~") === 0
  );
}

export function pathDirname(pathToDirOrFile: string): string {
  const pathParts: string[] = trimCharEnd(pathToDirOrFile, PATH_SEP).split(PATH_SEP);

  pathParts.pop();

  return pathParts.join(PATH_SEP);
}

export function pathBasename(pathToDirOrFile: string): string {
  const pathParts: string[] = pathToDirOrFile.split(PATH_SEP);

  return pathParts[pathParts.length - 1];
}

// TODO: неправильно - если relative то не должен удалять начальный /
// export function clearRelPathLeft(rawPath: string): string {
//   return rawPath.replace(/^[\s.\\~\/]*/, '')
// }

/**
 * Remove from path './', '../', '~/'
 * @param rawPath
 */
export function clearRelPath(rawPath: string): string {
  if (!rawPath) return ''

  return rawPath
    .trim()
    // remove ./ and ../ from full path
    .replace(/\.\.?\//g, '')
    // remove ~/ from the start of path
    .replace(/^~\//, '')
}

export function pathTrimExt(fileName: string): string {
  if (fileName.indexOf('.') < 0) return fileName

  const splat = fileName.split('.')

  splat.pop()

  return splat.join('.')
}

export function replaceExt(fileName: string, newExt: string): string {
  return `${pathTrimExt(fileName)}.${trimCharStart(newExt, '.')}`
}

export function getExt(fileName: string): string {
  const match = fileName.match(/\.(\w+)$/i)

  if (!match) return ''

  return match[1].toLowerCase()
}
