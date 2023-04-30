import { Promised } from './Promised.js';
import { DEFAULT_JOB_TIMEOUT_SEC } from './constants.js';
var ItemPosition;
(function (ItemPosition) {
    // promise of current cb
    ItemPosition[ItemPosition["pendingPromised"] = 0] = "pendingPromised";
    ItemPosition[ItemPosition["queuedCb"] = 1] = "queuedCb";
    // promise witch represent when the queued cb will be finished
    ItemPosition[ItemPosition["finishPromised"] = 2] = "finishPromised";
})(ItemPosition || (ItemPosition = {}));
const DEFAULT_ID = 'default';
/**
 * Simple queue where callbacks are overwritten by a new one.
 * Logic:
 * * cb is calling right now and promise which is returned is waiting while it will finished
 * * if other cb is added then it will be executed as soon as current cb finish
 * * if some else cb is added then it will replace previous cb which is in queue
 * * if there was an error while current cb is executed then queue will be cancelled
 * * if timeout of executing cb is exceeded then queue will be cleared
 */
export default class QueueOverride {
    jobTimeoutSec;
    items = {};
    // timeout of currentJob
    runningTimeout;
    // TODO: test
    get isDestroyed() {
        return Boolean(!this.items);
    }
    constructor(jobTimeoutSec = DEFAULT_JOB_TIMEOUT_SEC) {
        this.jobTimeoutSec = jobTimeoutSec;
    }
    destroy() {
        for (let id of Object.keys(this.items)) {
            const finishPromised = this.items[id][ItemPosition.finishPromised];
            if (finishPromised)
                finishPromised.destroy();
            this.items[id][ItemPosition.pendingPromised].destroy();
            this.clearTimeout();
        }
        // @ts-ignore
        delete this.items;
    }
    /**
     * Is current cb pending
     */
    isPending(id = DEFAULT_ID) {
        return Boolean(this.items[id]);
    }
    hasQueue(id = DEFAULT_ID) {
        if (!this.items || !this.items[id])
            return false;
        return Boolean(this.items[id][ItemPosition.queuedCb]);
    }
    /**
     * Stop waiting and clear timeouts.
     * It will resolve promises and removes queue and current cb.
     */
    stop(id = DEFAULT_ID) {
        if (!this.items || !this.items[id])
            return;
        const pendingPromised = this.items[id][ItemPosition.pendingPromised];
        const finishPromised = this.items[id][ItemPosition.finishPromised];
        this.clearTimeout();
        if (pendingPromised) {
            pendingPromised.resolve();
            pendingPromised.destroy();
        }
        if (finishPromised) {
            finishPromised.resolve();
            finishPromised.destroy();
        }
        delete this.items[id];
    }
    /**
     * Add cb into queue and return a promise that will be resolved after cb is finished.
     */
    add(cb, id = DEFAULT_ID) {
        if (this.isPending(id)) {
            const item = this.items[id];
            // just set or update a queued cb
            item[ItemPosition.queuedCb] = cb;
            // and crate a finished Promised if need
            if (!item[ItemPosition.finishPromised]) {
                item[ItemPosition.finishPromised] = new Promised();
            }
            // return promise which will be resolved after queued cb finished
            return item[ItemPosition.finishPromised].promise;
        }
        // else no one is in queue or pending - just start cb and return it's promise
        this.items[id] = [new Promised()];
        this.startCb(cb, id);
        return this.items[id][ItemPosition.pendingPromised].promise;
    }
    startCb(cb, id) {
        if (!this.items || !this.items[id])
            throw new Error(`No item ${id}`);
        this.runningTimeout = setTimeout(() => {
            this.handleJobTimeout(id);
        }, this.jobTimeoutSec * 1000);
        this.callCb(cb)
            .then(() => this.handleCbSuccess(id))
            .catch((e) => this.handleCbError(id, e));
    }
    handleCbError(id, e) {
        // if no item - means timeout has been exceeded
        if (!this.items || !this.items[id])
            return;
        // clear queue on error
        const pendingPromised = this.items[id][ItemPosition.pendingPromised];
        const finishPromised = this.items[id][ItemPosition.finishPromised];
        this.clearTimeout();
        // reject current cb promise
        pendingPromised.reject(e);
        pendingPromised.destroy();
        // if there is queue - then reject queue promise
        if (finishPromised) {
            finishPromised.reject(e);
            finishPromised.destroy();
        }
        delete this.items[id];
    }
    handleCbSuccess(id) {
        // if no item - means timeout has been exceeded
        if (!this.items || !this.items[id])
            return;
        const pendingPromised = this.items[id][ItemPosition.pendingPromised];
        this.clearTimeout();
        // resolve current cb promise
        pendingPromised.resolve();
        pendingPromised.destroy();
        this.startNextStep(id);
    }
    startNextStep(id) {
        if (this.hasQueue(id)) {
            // start queued cb if need and don't wait for it
            this.startQueue(id);
            return;
        }
        if (!this.items || !this.items[id])
            return;
        // or just finish cycle if there isn't a queued cb
        const finishPromised = this.items[id][ItemPosition.finishPromised];
        if (finishPromised) {
            finishPromised.reject(new Error(`No queue but there is finishPromised`));
        }
        delete this.items[id];
    }
    /**
     * Reject current cb and clear queue
     */
    handleJobTimeout(id) {
        // item definitely has to be at this moment
        if (!this.items || !this.items[id])
            return;
        const msg = `Timeout of job "${id}" has been exceeded`;
        const pendingPromised = this.items[id][ItemPosition.pendingPromised];
        const finishPromised = this.items[id][ItemPosition.finishPromised];
        // reject current cb promise
        pendingPromised.reject(new Error(msg));
        pendingPromised.destroy();
        // if there is queue - then reject queue promise
        if (finishPromised) {
            finishPromised.reject(new Error(msg));
            finishPromised.destroy();
        }
        delete this.items[id];
    }
    startQueue(id) {
        if (!this.items || !this.items[id])
            return;
        const queuedCb = this.items[id][ItemPosition.queuedCb];
        const finishPromised = this.items[id][ItemPosition.finishPromised];
        const newPendingPromised = new Promised();
        if (!queuedCb) {
            throw new Error(`No queuedCb`);
        }
        else if (!finishPromised) {
            throw new Error(`No finishPromised`);
        }
        // remove queue to start it
        delete this.items[id][ItemPosition.queuedCb];
        delete this.items[id][ItemPosition.finishPromised];
        // make current pending promise
        this.items[id][ItemPosition.pendingPromised] = newPendingPromised;
        this.startCb(queuedCb, id);
        newPendingPromised.promise
            .then(finishPromised.resolve)
            .catch(finishPromised.reject);
    }
    clearTimeout() {
        if (!this.runningTimeout)
            return;
        clearTimeout(this.runningTimeout);
        delete this.runningTimeout;
    }
    async callCb(cb) {
        await cb();
    }
}
