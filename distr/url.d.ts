import { JsonTypes } from './interfaces/Types.js';
export declare const URL_DELIMITER = "/";
interface LeftPartOfUrl {
    scheme: string;
    user?: string;
    password?: string;
    host: string;
    port?: number;
}
interface RightPartOfUrl {
    path: string;
    search?: {
        [index: string]: JsonTypes;
    };
    anchor?: string;
}
export interface ParsedUrl {
    scheme?: string;
    user?: string;
    password?: string;
    host?: string;
    port?: number;
    path?: string;
    search?: {
        [index: string]: JsonTypes;
    };
    anchor?: string;
}
/**
 * Parses whole url
 * WARNING: be careful with the next type of urls
 * * to/route - will be recognized as host "to" and path "/route"
 * * localhost#anchor - it is allowed but better to use slash - localhost/#anchor
 */
export declare function parseUrl(rawUrl: string): ParsedUrl;
/**
 * Parses value of search param.
 * Pass it already url decoded.
 * It supports arrays and objects in JSON format like:
 * * param1=[1, true, "str"]
 * * param1={"a": "str", "b": 5, "c": true}
 * Params which defined without value will have an empty string as a value according to URLSearchParams:
 * * param1&param2=2 => { param1: '', param2: 2 }
 */
export declare function parseSearchValue(rawValue: string | undefined): JsonTypes;
/**
 * Parse search part of url. Arrays and objects are supported:
 * * param1=value1&param2&param3=5&param4=true => { param1: 'value1', param2: '', param3: 5, param4: true }
 * * param1=[1, true, "str"] => { param1: [1, true, 'str'] }
 * * param1={"a": "str", "b": 5, "c": true} => { param1: {a: "str", b: 5, c: true} }
 */
export declare function parseSearch(rawSearch: string): {
    [index: string]: JsonTypes;
};
/**
 * Parse string:
 * * "host.com:8080" => { host: 'host.com', port: 8080 }
 * * "host.com" => { host: 'host.com' }
 */
export declare function parseHostPort(rawStr: string): {
    host: string;
    port?: number;
};
/**
 * Parse string like:
 * * "userName:password" => { user: 'userName', password: 'password' }
 * * "userName" => { user: 'userName' }
 */
export declare function parseUserPassword(rawStr: string): {
    user?: string;
    password?: string;
};
/**
 * Parses protocol, username, password, hostname and port of url
 */
export declare function parseLeftPartOfUrl(url: string): LeftPartOfUrl;
/**
 * Parses path, search and anchor.
 */
export declare function parseRightPartOfUrl(url: string): RightPartOfUrl;
/**
 * Split url to left and rigth parts.
 */
export declare function splitUrl(url: string): {
    left?: string;
    right?: string;
};
export {};
