import { DEFAULT_JOB_TIMEOUT_SEC } from './constants.js';
import { Promised } from './Promised.js';
import { isEmptyObject } from './objects.js';
import { callSafely } from './common.js';
/**
 * It supports only flat structure of data.
 */
export default class BufferedQueue {
    jobTimeoutSec;
    // The last actual state which is saved
    savedState = {};
    // temporary state while writing
    writingState;
    // temporary state which will be written when queued cb is called
    queueBuffer;
    queuePromised;
    queuedCb;
    get isDestroyed() {
        return !this.savedState;
    }
    constructor(jobTimeoutSec = DEFAULT_JOB_TIMEOUT_SEC) {
        this.jobTimeoutSec = jobTimeoutSec;
    }
    destroy() {
        if (this.queuePromised)
            this.queuePromised.destroy();
        // @ts-ignore
        delete this.savedState;
        delete this.queuePromised;
        delete this.queuedCb;
        delete this.writingState;
        delete this.queueBuffer;
    }
    getState() {
        return {
            ...this.savedState,
            ...this.writingState,
            ...this.queueBuffer,
        };
    }
    getSavedState() {
        return this.savedState;
    }
    getSavingState() {
        if (!this.writingState && this.queueBuffer)
            return;
        return {
            ...this.writingState,
            ...this.queueBuffer,
        };
    }
    /**
     * It means only some job is pending
     */
    isPending() {
        return Boolean(this.writingState);
    }
    isItemPending(key) {
        return Boolean(this.writingState && this.writingState[key]);
    }
    /**
     * It means is pending and has queue
     */
    hasQueue() {
        return Boolean(this.queueBuffer);
    }
    stop() {
        if (this.queuePromised)
            this.queuePromised.reject(new Error(`Stopped`));
        this.clearWholeJob();
    }
    clearItem(itemKey) {
        delete this.savedState[itemKey];
        if (this.writingState)
            delete this.writingState[itemKey];
        if (this.queueBuffer)
            delete this.queueBuffer[itemKey];
    }
    /**
     * If you add some object or array please clone it deeply before.
     */
    async add(cb, partialState) {
        // if some cb is in process and other is in queue - just update queue buffer and cb.
        if (this.hasQueue()) {
            if (!this.queuePromised)
                throw new Error(`no queuePromised`);
            // update queue buffer
            this.queueBuffer = {
                ...this.queueBuffer,
                ...partialState,
            };
            // replace cb to a new one
            this.queuedCb = cb;
            // return promise of the next cb is finished
            return this.queuePromised.promise;
        }
        // if some cb is in process but no queue - make queue buffer and queue cb.
        else if (this.isPending()) {
            // make queue buffer
            this.queueBuffer = {
                ...this.queueBuffer,
                ...partialState,
            };
            // save queue cb
            this.queuedCb = cb;
            // make promise of queued cb
            this.queuePromised = new Promised();
            // return promise of the next cb is finished
            return this.queuePromised.promise;
        }
        // else a new one
        // just return promise of current writing
        await this.writeFirstTime(cb, partialState);
    }
    async writeFirstTime(cb, partialState) {
        if (this.writingState || this.queueBuffer || this.queuedCb) {
            throw new Error(`Unappropriated state`);
        }
        // if data to save is empty then do nothing.
        else if (isEmptyObject(partialState))
            return;
        // it is used to get it in getState()
        this.writingState = { ...partialState };
        try {
            await cb(this.writingState);
        }
        catch (e) {
            if (this.queuePromised) {
                // At promise's catch handler you can have access to buffer.
                this.queuePromised.reject(new Error(`Cancelled because current write has returned an error: ${e}`));
            }
            // clear fully after rejecting
            this.clearWholeJob();
            throw e;
        }
        // on success
        this.onSuccess();
    }
    startQueuedCb() {
        if (!this.queueBuffer || !this.queuedCb || !this.queuePromised) {
            const msg = `no queueBuffer or queuedCb or queuePromised`;
            if (this.queuePromised)
                this.queuePromised.reject(new Error(msg));
            this.clearWholeJob();
            throw new Error(msg);
        }
        // if buffer was cleared during previous writing then do nothing.
        else if (isEmptyObject(this.queueBuffer)) {
            // resolve queued promise
            this.queuePromised.resolve();
            // finish the whole job
            this.clearWholeJob();
            return;
        }
        // make a new writing state
        this.writingState = { ...this.queueBuffer };
        const queuedCb = this.queuedCb;
        const queuePromised = this.queuePromised;
        // it will look like the first write is started
        delete this.queueBuffer;
        delete this.queuedCb;
        delete this.queuePromised;
        callSafely(queuedCb, this.writingState)
            .then(() => {
            // resolve queued promise
            queuePromised && queuePromised.resolve();
            this.onSuccess();
        })
            .catch((e) => {
            // At promise's catch handler you can have access to buffer.
            queuePromised.reject(e);
            this.queuePromised && this.queuePromised.reject(e);
            // finish the whole job after rejecting.
            this.clearWholeJob();
        });
    }
    onSuccess() {
        // set a new state which has been just saved
        this.savedState = {
            ...this.savedState,
            ...this.writingState,
        };
        if (this.hasQueue()) {
            delete this.writingState;
            this.startQueuedCb();
        }
        else {
            // finish the whole job
            this.clearWholeJob();
        }
    }
    clearWholeJob() {
        if (this.queuePromised && !this.queuePromised.isFulfilled()) {
            throw new Error(`Queue promise has to be fulfilled at clearing step`);
        }
        delete this.queuePromised;
        delete this.queuedCb;
        delete this.writingState;
        delete this.queueBuffer;
    }
}
