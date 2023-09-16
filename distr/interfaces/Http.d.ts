export type HttpMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';
export declare const HTTP_CONTENT_TYPES: {
    text: string;
    js: string;
    json: string;
    xml: string;
    yaml: string;
    css: string;
    html: string;
    octet: string;
};
export declare const HTTP_FILE_EXT_CONTENT_TYPE: {
    txt: string;
    js: string;
    json: string;
    css: string;
    html: string;
    xml: string;
    yml: string;
    yaml: string;
};
export interface HttpRequestBase {
    method: HttpMethods;
    url: string;
    headers: Record<string, string>;
}
export interface HttpRequest extends HttpRequestBase {
    body?: string | Uint8Array;
}
export interface HttpResponse {
    headers: Record<string, string>;
    status: number;
    body?: string | Uint8Array;
}
