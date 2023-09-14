import { JsonTypes } from './interfaces/Types.js';
import { HttpContentType } from './interfaces/Http.js';
export declare function isHtml(str: any): boolean;
/**
 * Parse request's body. It should correspond to content-type header.
 * But if content-type isn't supported then body will be used as is.
 */
export declare function parseBody(contentType?: HttpContentType, body?: string | Uint8Array): JsonTypes | Uint8Array | undefined;
/**
 * Prepare body to response
 */
export declare function prepareBody(contentType: HttpContentType | undefined, fullBody?: JsonTypes | Uint8Array): string | Uint8Array | undefined;
/**
 * Resolve body type which will be prepared in prepareBody() and sent. Logic
 * * undefined => undefined
 * * Uint8Array => application/octet-stream
 * * has "doctype html" => text/html
 * * string
 * * number, boolean, null, [] or {} => application/json
 */
export declare function resolveBodyType(fullBody?: JsonTypes | Uint8Array): HttpContentType | undefined;
