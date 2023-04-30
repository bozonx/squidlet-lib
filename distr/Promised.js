export class Promised {
    get promise() {
        return this._promise;
    }
    _promise;
    promiseResolve;
    promiseReject;
    resolved = false;
    rejected = false;
    canceled = false;
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
    }
    destroy() {
        delete this.promiseResolve;
        delete this.promiseReject;
        // @ts-ignore
        delete this._promise;
    }
    resolve = (result) => {
        if (this.canceled)
            return;
        if (this.promiseResolve)
            this.promiseResolve(result);
        this.resolved = true;
        delete this.promiseResolve;
        delete this.promiseReject;
    };
    reject = (err) => {
        if (this.canceled)
            return;
        if (this.promiseReject)
            this.promiseReject(err);
        this.rejected = true;
        delete this.promiseResolve;
        delete this.promiseReject;
    };
    /**
     * After cancel promise won't be able to be fulfilled.
     * If promise was fulfilled it can't be cancelled.
     */
    cancel() {
        if (this.isFulfilled())
            return;
        this.canceled = true;
        delete this.promiseResolve;
        delete this.promiseReject;
    }
    isResolved() {
        return this.resolved;
    }
    isRejected() {
        return this.rejected;
    }
    isCanceled() {
        return this.canceled;
    }
    isFulfilled() {
        return this.resolved || this.rejected;
    }
}
