export type HttpMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';
// export type HttpContentType = 'text/plain'
//   | 'text/html'
//   | 'application/json'
//   | 'application/javascript'
//   | 'application/xml'
//   | 'application/octet-stream';

export const HTTP_CONTENT_TYPES = {
  text: 'text/plain; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  yaml: 'text/yaml charset=utf-8',
  css: 'text/css; charset=utf-8',
  html: 'text/html; charset=utf-8',
  octet: 'application/octet-stream',
}

export const HTTP_FILE_EXT_CONTENT_TYPE = {
  txt: HTTP_CONTENT_TYPES.text,
  js: HTTP_CONTENT_TYPES.js,
  json: HTTP_CONTENT_TYPES.json,
  css: HTTP_CONTENT_TYPES.css,
  html: HTTP_CONTENT_TYPES.html,
  xml: HTTP_CONTENT_TYPES.xml,
  yml: HTTP_CONTENT_TYPES.yaml,
  yaml: HTTP_CONTENT_TYPES.yaml,
}

// interface CommonHeaders {
//   'content-type'?: HttpContentType;
// }

// export interface HttpRequestHeaders extends CommonHeaders {
// }
//
// export interface HttpResponseHeaders extends CommonHeaders {
// }

export interface HttpRequestBase {
  method: HttpMethods
  url: string
  headers: Record<string, string>
}

export interface HttpRequest extends HttpRequestBase {
  body?: string | Uint8Array
}

export interface HttpResponse {
  headers: Record<string, string>
  status: number
  body?: string | Uint8Array
}
