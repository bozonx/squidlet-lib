
// TODO: может наследовать от Promise

export class Promised<T = any> {
  /**
   * Create a promised which is already resolved.
   * @param result - result of promise
   * @returns promised
   */
  static alreadyResolved<T = any>(result: T): Promised<T> {
    const promised = new Promised<T>();

    promised.resolve(result);

    return promised;
  }

  /**
   * Create a promised which is already rejected.
   * @param err - error of promise
   * @returns promised
   */
  static alreadyRejected(err: Error | string): Promised {
    const promised = new Promised();

    promised.reject(err);

    return promised;
  }

  private _timeoutMs?: number;
  private _timeoutId?: NodeJS.Timeout;
  private _result: T | undefined;
  private _error: Error | string | undefined;
  private _promise: Promise<T>;
  private promiseResolve?: (result?: T) => void;
  private promiseReject?: (err: Error | string) => void;
  private resolved: boolean = false;
  private rejected: boolean = false;
  private canceled: boolean = false;
  // is timeout of promise exceeded
  private exceeded: boolean = false;

  get result() {
    return this._result;
  }

  get error() {
    return this._error;
  }

  get promise(): Promise<T> {
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

  get timeoutMs(): number | undefined {
    return this._timeoutMs;
  }

  /**
   * Start the promise.
   */
  constructor(timoutMs?: number) {
    this._promise = new Promise<T>((resolve: any, reject) => {
      this.promiseResolve = resolve;
      this.promiseReject = reject;
    });

    if (timoutMs) {
      this._timeoutMs = timoutMs;
      this._timeoutId = setTimeout(() => {
        if (this.canceled || this.resolved || this.rejected) {
          delete this._timeoutId;
          return;
        }

        this.exceeded = true;

        // TODO: вызвать reject

        // if (this.promiseReject)
        //   this.promiseReject(
        //     new Error(`Promise exceeded timeout of ${timoutMs}ms`)
        //   );

        // TODO: отвязаться от промиса

        delete this.promiseResolve;
        delete this.promiseReject;
      }, timoutMs);
    }
  }

  destroy() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      delete this._timeoutId;
    }

    delete this.promiseResolve;
    delete this.promiseReject;
    // @ts-ignore
    delete this._promise;
  }

  /**
   * Do resolve the promise.
   * @param result - result of promise
   */
  resolve = (result?: T) => {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      delete this._timeoutId;
    }

    if (!this.isPending()) return;

    this._result = result;

    if (this.promiseResolve) this.promiseResolve(result);

    this.resolved = true;

    delete this.promiseResolve;
    delete this.promiseReject;
  };

  /**
   * Do reject the promise.
   * @param err - error of promise
   */
  reject = (err: Error | string) => {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      delete this._timeoutId;
    }

    if (!this.isPending()) return;

    this._error = err;

    if (this.promiseReject) this.promiseReject(err);

    this.rejected = true;

    delete this.promiseResolve;
    delete this.promiseReject;
  };

  /**
   * After cancel promise won't be able to be fulfilled.
   * If promise was fulfilled it can't be cancelled.
   */
  cancel() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      delete this._timeoutId;
    }

    if (!this.isPending()) return;

    this.canceled = true;

    delete this.promiseResolve;
    delete this.promiseReject;
  }

  isResolved(): boolean {
    return this.resolved;
  }

  isRejected(): boolean {
    return this.rejected;
  }

  isCanceled(): boolean {
    return this.canceled;
  }

  isFulfilled(): boolean {
    return this.resolved || this.rejected;
  }

  isExceeded(): boolean {
    return this.exceeded;
  }

  isPending(): boolean {
    return !this.resolved && !this.rejected && !this.canceled && !this.exceeded;
  }
}
