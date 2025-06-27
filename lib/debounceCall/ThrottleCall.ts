import { Promised } from "../Promised.js";
import {
  type DebounceCb,
  type DebounceItem,
  ItemPosition,
} from "./DebounceCall.js";

export const THROTTLE_DEFAULT_ID = "default";

/**
 * Call only the first callback of specified id and refuse other calls while timeout is in progress.
 * If cb was called with error the timeout will be started any way.
 * If debounceMs isn't set then current timeout will be cleared
 */
export class ThrottleCall {
  // items by id
  protected items: { [index: string]: DebounceItem } = {};

  isInvoking(id: string | number = THROTTLE_DEFAULT_ID): boolean {
    return Boolean(this.items[id]);
  }

  invoke(
    cb: DebounceCb,
    debounceMs: number | undefined,
    id: string | number = THROTTLE_DEFAULT_ID
  ): Promise<void> {
    // if there isn't debounce time - call immediately without any timeout
    if (!debounceMs) {
      return this.callCbImmediately(id, cb);
    }

    if (!this.items[id]) {
      const timeout = setTimeout(() => this.endOfTimeout(id), debounceMs);
      // make a new item
      this.items[id] = [cb, new Promised<void>(), timeout];

      try {
        cb();
      } catch (e) {
        // do nothing if cb ends with error - just wait debounce
      }
    }

    // return promise if item exist or not
    return this.items[id][
      ItemPosition.promiseForWholeDebounce
    ].extractPromise();
  }

  clear(id: string | number) {
    if (!this.items[id]) return;

    if (this.items[id][ItemPosition.timeout])
      clearTimeout(this.items[id][ItemPosition.timeout]);

    this.items[id][ItemPosition.promiseForWholeDebounce].resolve();

    delete this.items[id];
  }

  clearAll() {
    for (let id of Object.keys(this.items)) {
      this.clear(id);
    }
  }

  destroy() {
    for (let id of Object.keys(this.items)) {
      if (this.items[id][ItemPosition.timeout])
        clearTimeout(this.items[id][ItemPosition.timeout]);

      this.items[id][ItemPosition.promiseForWholeDebounce].destroy();

      delete this.items[id];
    }
  }

  private endOfTimeout(id: string | number) {
    if (this.items[id][ItemPosition.timeout])
      clearTimeout(this.items[id][ItemPosition.timeout]);

    const promised = this.items[id][ItemPosition.promiseForWholeDebounce];

    delete this.items[id];

    promised.resolve();
    promised.destroy();
  }

  private async callCbImmediately(id: string | number, cb: DebounceCb) {
    if (typeof this.items[id] !== "undefined") this.clear(id);

    cb();
  }
}
