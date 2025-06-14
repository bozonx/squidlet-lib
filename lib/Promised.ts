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

  private _resolvedHandlers: ((result?: T) => void)[] = [];
  private _rejectedHandlers: ((err: Error | string) => void)[] = [];
  private _canceledHandlers: (() => void)[] = [];
  private _exceededHandlers: (() => void)[] = [];
  private _anyStateChangeHandlers: (() => void)[] = [];
  // except canceled state
  private _finalyHandlers: (() => void)[] = [];

  private _resolved: boolean = false;
  private _rejected: boolean = false;
  private _canceled: boolean = false;
  // is timeout of promise exceeded
  private _exceeded: boolean = false;

  private _startTimeoutMs?: number;
  private _startTimeoutId?: NodeJS.Timeout;
  private _waitTimeoutMs?: number;
  private _waitTimeoutId?: NodeJS.Timeout;
  private _result: T | undefined;
  private _error: Error | string | undefined;
  private _testCb: ((...args: any[]) => boolean | undefined) | undefined;

  /**
   * Get the final result of the promise.
   * @returns result of promise
   */
  get result() {
    return this._result;
  }

  /**
   * Get the final error of the promise.
   * @returns error of promise
   */
  get error() {
    return this._error;
  }

  // get promise(): Promise<T> {
  //   return this._promise;
  // }

  /**
   * Get the timeout in ms of the start function.
   * @returns timeout of promise
   */
  get startTimeoutMs(): number | undefined {
    return this._startTimeoutMs;
  }

  /**
   * Get the timeout in ms of the wait function.
   * @returns timeout of promise
   */
  get waitTimeoutMs(): number | undefined {
    return this._waitTimeoutMs;
  }

  constructor() {}

  destroy() {
    if (this._startTimeoutId) {
      clearTimeout(this._startTimeoutId);
      delete this._startTimeoutId;
    }

    if (this._waitTimeoutId) {
      clearTimeout(this._waitTimeoutId);
      delete this._waitTimeoutId;
    }

    if (this._testCb) delete this._testCb;

    this._clearHandlers();
  }

  // TODO: add test
  /**
   * Wait for the promise to be resolved or rejected.
   * Do not call this and start function again.
   * @param testCb - callback to test the promise. If it returns true then the promise will be resolved.
   * @param timeoutMs - timeout in milliseconds
   * @returns promised
   */
  wait(
    testCb: (...args: any[]) => boolean | undefined,
    timeoutMs: number
  ): Promised<T> {
    this._testCb = testCb;
    this._waitTimeoutMs = timeoutMs;
    this._waitTimeoutId = setTimeout(() => {
      if (!this.isPending()) return;

      this.exceed();
    }, timeoutMs);

    return this;
  }

  /**
   * Test the cb of wait function.
   * @param args - arguments to test the cb
   * @returns promised
   */
  test(...args: any[]): Promised<T> {
    if (!this._testCb) return this;

    let result: boolean | undefined;

    try {
      result = this._testCb(...args);
    } catch (err) {
      // skip error
    }

    if (result) {
      this.resolve();
    }

    return this;
  }

  // TODO: add test
  /**
   * Start the promise.
   * Do not call this and wait function again.
   * @param timoutMs - timeout in milliseconds. If exceeded then promise will be rejected.
   */
  start(externalPromise: Promise<T>, timoutMs?: number): Promised<T> {
    if (timoutMs) {
      this._startTimeoutMs = timoutMs;
      this._startTimeoutId = setTimeout(() => {
        if (!this.isPending()) return;

        this.exceed();
      }, timoutMs);
    }

    externalPromise
      .then((result) => {
        if (!this.isPending()) return;

        this.resolve(result);
      })
      .catch((error) => {
        if (!this.isPending()) return;

        this.reject(error as Error);
      });

    return this;
  }

  catch(cb: (err: Error | string) => void): Promised<T> {
    this._rejectedHandlers.push(cb);

    return this;
  }

  then(cb: (result?: T) => void): Promised<T> {
    this._resolvedHandlers.push(cb);

    return this;
  }

  finally(cb: () => void): Promised<T> {
    this._finalyHandlers.push(cb);

    return this;
  }

  onExceeded(cb: () => void): Promised<T> {
    this._exceededHandlers.push(cb);

    return this;
  }

  onCancel(cb: () => void): Promised<T> {
    this._canceledHandlers.push(cb);

    return this;
  }

  /**
   * On any change state: resolved, rejected, canceled, exceeded.
   * @param cb - callback to do
   * @returns promised
   */
  onStateChange(cb: () => void): Promised<T> {
    this._anyStateChangeHandlers.push(cb);

    return this;
  }

  /**
   * Do resolve the promise.
   * @param result - result of promise
   */
  resolve = (result?: T) => {
    if (this._startTimeoutId) {
      clearTimeout(this._startTimeoutId);
      delete this._startTimeoutId;
    }

    if (this._waitTimeoutId) {
      clearTimeout(this._waitTimeoutId);
      delete this._waitTimeoutId;
    }

    if (this._testCb) delete this._testCb;

    // can't resolve more than once
    if (!this.isPending()) return;

    this._result = result;
    this._resolved = true;

    for (const handler of this._resolvedHandlers) {
      handler(result);
    }

    for (const handler of this._anyStateChangeHandlers) {
      handler();
    }

    for (const handler of this._finalyHandlers) {
      handler();
    }

    this._clearHandlers();
  };

  /**
   * Do reject the promise.
   * @param err - error of promise
   */
  reject = (err: Error | string) => {
    if (this._startTimeoutId) {
      clearTimeout(this._startTimeoutId);
      delete this._startTimeoutId;
    }

    if (this._waitTimeoutId) {
      clearTimeout(this._waitTimeoutId);
      delete this._waitTimeoutId;
    }

    if (this._testCb) delete this._testCb;

    // can't reject more than once
    if (this._rejected || this._canceled || this._resolved) return;

    this._error = err;
    this._rejected = true;

    for (const handler of this._rejectedHandlers) {
      handler(err);
    }

    for (const handler of this._anyStateChangeHandlers) {
      handler();
    }

    for (const handler of this._finalyHandlers) {
      handler();
    }

    this._clearHandlers();
  };

  /**
   * Change to exceeded state.
   * It will reject the promise also.
   */
  exceed = () => {
    if (this._startTimeoutId) {
      clearTimeout(this._startTimeoutId);
      delete this._startTimeoutId;
    }

    if (this._waitTimeoutId) {
      clearTimeout(this._waitTimeoutId);
      delete this._waitTimeoutId;
    }

    if (this._testCb) delete this._testCb;

    // can't reject more than once
    if (this._rejected || this._canceled || this._resolved) return;

    this._error = new Error(`Promise exceeded timeout`);
    this._rejected = true;
    this._exceeded = true;

    for (const handler of this._rejectedHandlers) {
      handler(this._error);
    }

    for (const handler of this._exceededHandlers) {
      handler();
    }

    for (const handler of this._anyStateChangeHandlers) {
      handler();
    }

    for (const handler of this._finalyHandlers) {
      handler();
    }

    this._clearHandlers();
  };

  /**
   * After cancel promise won't be able to be fulfilled.
   * If promise was fulfilled it can't be cancelled.
   */
  cancel() {
    if (this._startTimeoutId) {
      clearTimeout(this._startTimeoutId);
      delete this._startTimeoutId;
    }

    if (this._waitTimeoutId) {
      clearTimeout(this._waitTimeoutId);
      delete this._waitTimeoutId;
    }

    if (!this.isPending()) return;

    this._canceled = true;

    for (const handler of this._canceledHandlers) {
      handler();
    }

    for (const handler of this._anyStateChangeHandlers) {
      handler();
    }

    this._clearHandlers();
  }

  isResolved(): boolean {
    return this._resolved;
  }

  isRejected(): boolean {
    return this._rejected;
  }

  isFulfilled(): boolean {
    return this._resolved || this._rejected;
  }

  isPending(): boolean {
    return (
      !this._resolved && !this._rejected && !this._canceled && !this._exceeded
    );
  }

  isCanceled(): boolean {
    return this._canceled;
  }

  isExceeded(): boolean {
    return this._exceeded;
  }

  private _clearHandlers() {
    this._resolvedHandlers = [];
    this._rejectedHandlers = [];
    this._canceledHandlers = [];
    this._exceededHandlers = [];
    this._anyStateChangeHandlers = [];
    this._finalyHandlers = [];
  }
}
