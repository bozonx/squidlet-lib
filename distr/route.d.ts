import { Primitives } from './interfaces/Types.js';
export interface MatchRouteResult {
    route: string;
    params: {
        [index: string]: Primitives;
    };
}
/**
 * Remove trailing slash and add slash to the beginning if it doesn't have it
 */
export declare function prepareRoute(rawRoute: string): string;
/**
 * Match urlPath with route and return route and route params.
 * Example: '/path/to/actionName/value1/' => {
 *   route: '/path/to/:action/:param1'
 *   params: { action: 'actionName', param1: 'value1' }
 * }
 * @param urlPath - path part of url
 * @param allRoutes - all the available routes
 */
export declare function matchRoute(urlPath: string, allRoutes: string[]): MatchRouteResult | undefined;
export declare function filterRoutes(urlPath: string, allRoutes: string[]): string[];
/**
 * Parse params. Example:
 * * url: /path/to/action/myAction/sub-url/5/true
 * * params: /path/to/action/:actionName/sub-url/:param1/:param2
 * * result: { actionName: 'myAction', param1: 5, param2: true }
 */
export declare function parseRouteParams(url: string, route: string): {
    [index: string]: Primitives;
};
