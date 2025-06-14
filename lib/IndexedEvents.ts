import {isPromise} from './common.js';
import { Promised } from "./Promised.js";

export type AnyHandler = (...args: any[]) => void;

export class IndexedEvents<T extends AnyHandler> {
  // all the handlers by index, removed handlers are empty
  private handlers: (T | undefined)[] = [];

  // TODO: test
  get isDestroyed(): boolean {
    return typeof this.handlers === "undefined";
  }

  /**
   * Get all the handlers.
   * Removed handlers will be undefined
   */
  getListeners(): (T | undefined)[] {
    return this.handlers;
  }

  hasListeners(): boolean {
    return Boolean(this.handlers.length);
  }

  emit: T = ((...args: any[]) => {
    for (let handler of this.handlers) {
      if (handler) handler(...args);
    }
  }) as T;

  emitSync = async (...args: any[]): Promise<void> => {
    for (let handler of this.handlers) {
      if (!handler) continue;

      await handler(...args);
    }
  };

  // TODO: можно сделать вариант когда выполняются все, ошибочные пропускаются и выводятся ошибки списокм

  // TODO: test
  emitAll = async (...args: any[]): Promise<void> => {
    const promises: Promise<any>[] = [];

    for (let handler of this.handlers) {
      if (!handler) continue;

      const result: any = handler(...args);

      if (isPromise(result)) {
        promises.push(result);
      }
    }

    return Promise.all(promises).then(() => undefined);
  };

  /**
   * Register listener and return its index.
   */
  addListener(handler: T): number {
    this.handlers.push(handler);

    return this.handlers.length - 1;
  }

  once(handler: T): number {
    let wrapperIndex: number;
    const wrapper = ((...args: any[]) => {
      this.removeListener(wrapperIndex);
      // return in promise case
      return handler(...args);
    }) as T;

    wrapperIndex = this.addListener(wrapper);

    return wrapperIndex;
  }

  removeListener(handlerIndex?: number): void {
    if (typeof handlerIndex === "undefined") return;
    // TODO: test что после дестроя не будет поднимать ошибки
    else if (this.isDestroyed) return;
    else if (!this.handlers[handlerIndex]) return;

    delete this.handlers[handlerIndex];
  }

  removeAll(): void {
    this.handlers.splice(0, this.handlers.length);
  }

  destroy() {
    // @ts-ignore
    delete this.handlers;
  }

  // TODO: test
  /**
   * Wait for event to be emitted.
   * @param testCb - Callback to check if the event has been emitted.
   *   It will receive an array of arguments.
   * @param timeoutMs - Timeout in milliseconds.
   * @returns Promise that resolves when the event has been emitted.
   */
  wait(
    testCb: (args: any[]) => boolean | undefined,
    timeoutMs: number
  ): Promised<any> {
    const promised = new Promised<any[]>().wait(testCb, timeoutMs);
    const handler = (...args: any[]): void => {
      promised.test(args);
    };

    let handlerIndex = this.addListener(handler as T);

    promised.onStateChange(() => {
      this.removeListener(handlerIndex);
    });

    return promised;
  }
}
