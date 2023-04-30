export declare class Promised<T = any> {
    get promise(): Promise<T>;
    private _promise;
    private promiseResolve?;
    private promiseReject?;
    private resolved;
    private rejected;
    private canceled;
    constructor();
    destroy(): void;
    resolve: (result?: T) => void;
    reject: (err: Error) => void;
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
