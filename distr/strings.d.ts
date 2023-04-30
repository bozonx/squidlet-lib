export declare function trimCharStart(src: string, char?: string): string;
export declare function trimCharEnd(src: string, char?: string): string;
export declare function trimChar(src: string, char?: string): string;
/**
 * Turn only the first letter to upper case
 */
export declare function firstLetterToUpperCase(value: string): string;
/**
 * Split first element of path using separator. 'path/to/dest' => [ 'path', 'to/dest' ]
 */
export declare function splitFirstElement(fullPath: string, separator: string): [string, string | undefined];
/**
 * Split last part of path. 'path/to/dest' => [ 'dest', 'path/to' ]
 */
export declare function splitLastElement(fullPath: string, separator: string): [string, string | undefined];
export declare function padStart(srcString: string, length?: number, chars?: string): string;
