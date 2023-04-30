export declare const PATH_SEP = "/";
/**
 * Join paths.
 * pathJoin('/path/', '/to/', './dir') => '/path/to/./dir'.
 * It clears doubling of delimiters
 */
export declare function pathJoin(...paths: string[]): string;
export declare function pathIsAbsolute(pathToDirOrFile: string): boolean;
export declare function pathDirname(pathToDirOrFile: string): string;
export declare function pathBasename(pathToDirOrFile: string): string;
export declare function clearRelPathLeft(rawPath: string): string;
export declare function pathTrimExt(fileName: string): string;
export declare function replaceExt(fileName: string, newExt: string): string;
