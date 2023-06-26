// TODO: может наследовать от Promise
export class Promised {
    static alreadyResolved(result) {
        const promised = new Promised();
        promised.resolve(result);
        return promised;
    }
    static alreadyRejected(err) {
        const promised = new Promised();
        promised.reject(err);
        return promised;
    }
    _result;
    _error;
    _promise;
    promiseResolve;
    promiseReject;
    resolved = false;
    rejected = false;
    canceled = false;
    get result() {
        return this._result;
    }
    get error() {
        return this._error;
    }
    get promise() {
        return this._promise;
    }
    get catch() {
        return this._promise.catch;
    }
    get then() {
        return this._promise.then;
    }
    get finally() {
        return this._promise.finally;
    }
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
        this._result = result;
        if (this.promiseResolve)
            this.promiseResolve(result);
        this.resolved = true;
        delete this.promiseResolve;
        delete this.promiseReject;
    };
    reject = (err) => {
        if (this.canceled)
            return;
        this._error = err;
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
