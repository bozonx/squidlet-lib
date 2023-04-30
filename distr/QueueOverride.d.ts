type QueuedCb = () => Promise<void> | void;
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
    private readonly jobTimeoutSec;
    private items;
    private runningTimeout?;
    get isDestroyed(): boolean;
    constructor(jobTimeoutSec?: number);
    destroy(): void;
    /**
     * Is current cb pending
     */
    isPending(id?: string | number): boolean;
    hasQueue(id?: string | number): boolean;
    /**
     * Stop waiting and clear timeouts.
     * It will resolve promises and removes queue and current cb.
     */
    stop(id?: string | number): void;
    /**
     * Add cb into queue and return a promise that will be resolved after cb is finished.
     */
    add(cb: QueuedCb, id?: string | number): Promise<void>;
    private startCb;
    private handleCbError;
    private handleCbSuccess;
    private startNextStep;
    /**
     * Reject current cb and clear queue
     */
    private handleJobTimeout;
    private startQueue;
    private clearTimeout;
    private callCb;
}
export {};
