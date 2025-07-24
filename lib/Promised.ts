export class Promised<T = any | any[]> extends Promise<T> {
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
  static alreadyRejected(err: Error): Promised {
    const promised = new Promised();

    promised.reject(err);

    return promised;
  }

  private _resolvedHandlers: ((result?: T) => void)[] = [];
  private _rejectedHandlers: ((err: Error) => void)[] = [];
  private _catchHandlers: ((err: Error) => void)[] = [];
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
  private _error: Error | undefined;
  private _testCb: ((args: any | any[]) => boolean | undefined) | undefined;

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

  constructor(
    executor?: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    if (executor) {
      super(executor);
    } else {
      super(() => {});
    }
  }

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
  test(data: any | any[]): Promised<T> {
    if (!this._testCb) return this;

    let result: boolean | undefined;

    try {
      result = this._testCb(data);
    } catch (err) {
      // skip error
    }

    if (result) {
      this.resolve(data);
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

  /**
   * Handle only promise rejection
   * @param cb - callback to handle rejection
   * @returns promised
   */
  rejected(cb: (err: Error) => void): Promised<T> {
    this._rejectedHandlers.push(cb);

    return this;
  }

  /**
   * Handle promise rejection and exceeded states (custom handler)
   * @param cb - callback to handle rejection
   * @returns promised
   */
  onCatch(cb: (err: Error) => void): Promised<T> {
    this._catchHandlers.push(cb);

    return this;
  }

  /**
   * Handle promise resolution (custom handler)
   * @param cb - callback to handle resolution
   * @returns promised
   */
  onThen(cb: (result?: T) => void): Promised<T> {
    this._resolvedHandlers.push(cb);

    return this;
  }

  /**
   * Handle promise finalization (custom handler)
   * @param cb - callback to handle finalization
   * @returns promised
   */
  onFinally(cb: () => void): Promised<T> {
    this._finalyHandlers.push(cb);

    return this;
  }

  /**
   * Override native Promise.then method to maintain compatibility
   * @param onfulfilled - callback for successful resolution
   * @param onrejected - callback for rejection
   * @returns new Promised instance
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): Promised<TResult1 | TResult2> {
    // Create a new native Promise that wraps our custom logic
    const nativePromise = new Promise<TResult1 | TResult2>(
      (resolve, reject) => {
        // Handle resolution
        this._resolvedHandlers.push((result) => {
          if (onfulfilled) {
            try {
              const transformedResult = onfulfilled(result as T);
              if (transformedResult instanceof Promise) {
                transformedResult.then(resolve).catch(reject);
              } else {
                resolve(transformedResult);
              }
            } catch (error) {
              reject(error);
            }
          } else {
            resolve(result as TResult1);
          }
        });

        // Handle rejection
        this._catchHandlers.push((error) => {
          if (onrejected) {
            try {
              const transformedResult = onrejected(error);
              if (transformedResult instanceof Promise) {
                transformedResult.then(resolve).catch(reject);
              } else {
                resolve(transformedResult);
              }
            } catch (finalError) {
              reject(finalError);
            }
          } else {
            reject(error);
          }
        });

        // If already resolved/rejected, trigger immediately
        if (this._resolved) {
          if (onfulfilled) {
            try {
              const transformedResult = onfulfilled(this._result as T);
              if (transformedResult instanceof Promise) {
                transformedResult.then(resolve).catch(reject);
              } else {
                resolve(transformedResult);
              }
            } catch (error) {
              reject(error);
            }
          } else {
            resolve(this._result as TResult1);
          }
        } else if (this._rejected) {
          if (onrejected) {
            try {
              const transformedResult = onrejected(this._error!);
              if (transformedResult instanceof Promise) {
                transformedResult.then(resolve).catch(reject);
              } else {
                resolve(transformedResult);
              }
            } catch (finalError) {
              reject(finalError);
            }
          } else {
            reject(this._error!);
          }
        }
      }
    );

    // Create new Promised instance that wraps the native promise
    const newPromised = new Promised<TResult1 | TResult2>();
    nativePromise.then(
      (result) => newPromised.resolve(result),
      (error) => newPromised.reject(error)
    );

    return newPromised;
  }

  /**
   * Override native Promise.catch method to maintain compatibility
   * @param onrejected - callback for rejection
   * @returns new Promised instance
   */
  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | null
      | undefined
  ): Promised<T | TResult> {
    return this.then(undefined, onrejected);
  }

  /**
   * Override native Promise.finally method to maintain compatibility
   * @param onfinally - callback for finalization
   * @returns new Promised instance
   */
  finally(onfinally?: (() => void) | null | undefined): Promised<T> {
    // Create a new native Promise that wraps our custom logic
    const nativePromise = new Promise<T>((resolve, reject) => {
      const handleFinally = () => {
        if (onfinally) {
          try {
            onfinally();
          } catch (error) {
            reject(error);
            return;
          }
        }
        if (this._resolved) {
          resolve(this._result as T);
        } else if (this._rejected) {
          reject(this._error!);
        }
      };

      if (this._resolved || this._rejected) {
        handleFinally();
      } else {
        this._finalyHandlers.push(handleFinally);
      }
    });

    // Create new Promised instance that wraps the native promise
    const newPromised = new Promised<T>();
    nativePromise.then(
      (result) => newPromised.resolve(result),
      (error) => newPromised.reject(error)
    );

    return newPromised;
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
  reject = (err: Error) => {
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
    if (!this.isPending()) return;

    this._error = err;
    this._rejected = true;

    for (const handler of this._rejectedHandlers) {
      handler(err);
    }

    for (const handler of this._catchHandlers) {
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

    if (!this.isPending()) return;

    this._error = new Error(`Promise exceeded timeout`);
    this._exceeded = true;
    this._rejected = true;

    for (const handler of this._catchHandlers) {
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

  extractPromise(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.onThen((result) => resolve(result as T)).onCatch(reject);
    });
  }

  isResolved(): boolean {
    return this._resolved;
  }

  /**
   * Check if the promise is caught error or exceeded timeout.
   * @returns true if the promise is caught
   */
  isCaught(): boolean {
    return this._rejected || this._exceeded;
  }

  /**
   * Check if the promise is rejected.
   * @returns true if the promise is rejected
   */
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
    this._catchHandlers = [];
    this._canceledHandlers = [];
    this._exceededHandlers = [];
    this._anyStateChangeHandlers = [];
    this._finalyHandlers = [];
  }
}
