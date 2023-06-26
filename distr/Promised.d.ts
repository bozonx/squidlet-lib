export declare class Promised<T = any> {
    static alreadyResolved<T = any>(result: T): Promised<T>;
    static alreadyRejected(err: Error | string): Promised;
    private _result;
    private _error;
    private _promise;
    private promiseResolve?;
    private promiseReject?;
    private resolved;
    private rejected;
    private canceled;
    get result(): T | undefined;
    get error(): string | Error | undefined;
    get promise(): Promise<T>;
    get catch(): <TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined) => Promise<T | TResult>;
    get then(): <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>;
    get finally(): (onfinally?: (() => void) | null | undefined) => Promise<T>;
    constructor();
    destroy(): void;
    resolve: (result?: T) => void;
    reject: (err: Error | string) => void;
    /**
     * After cancel promise won't be able to be fulfilled.
     * If promise was fulfilled it can't be cancelled.
     */
    cancel(): void;
    isResolved(): boolean;
    isRejected(): boolean;
    isCanceled(): boolean;
    isFulfilled(): boolean;
}
