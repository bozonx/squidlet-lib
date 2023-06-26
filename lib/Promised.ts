
// TODO: может наследовать от Promise

export class Promised<T = any> {
  static alreadyResolved<T = any>(result: T): Promised<T> {
    const promised = new Promised<T>()

    promised.resolve(result)

    return promised
  }

  static alreadyRejected(err: Error | string): Promised {
    const promised = new Promised()

    promised.reject(err)

    return promised
  }

  private _result: T | undefined
  private _error: Error | string | undefined
  private _promise: Promise<T>;
  private promiseResolve?: (result?: T) => void;
  private promiseReject?: (err: Error | string) => void;
  private resolved: boolean = false;
  private rejected: boolean = false;
  private canceled: boolean = false;

  get result() {
    return this._result
  }

  get error() {
    return this._error
  }

  get promise(): Promise<T> {
    return this._promise;
  }

  get catch() {
    return this._promise.catch;
  }

  get then() {
    return this._promise.then
  }

  get finally() {
    return this._promise.finally
  }


  constructor() {
    this._promise = new Promise<T>((resolve: any, reject) => {
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


  resolve = (result?: T) => {
    if (this.canceled) return;

    this._result = result

    if (this.promiseResolve) this.promiseResolve(result);

    this.resolved = true;

    delete this.promiseResolve;
    delete this.promiseReject;
  }

  reject = (err: Error | string) => {
    if (this.canceled) return;

    this._error = err

    if (this.promiseReject) this.promiseReject(err);

    this.rejected = true;

    delete this.promiseResolve;
    delete this.promiseReject;
  }

  /**
   * After cancel promise won't be able to be fulfilled.
   * If promise was fulfilled it can't be cancelled.
   */
  cancel() {
    if (this.isFulfilled()) return;

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

}
