type QueuedCb = (stateToSave: {
    [index: string]: any;
}) => Promise<void>;
/**
 * It supports only flat structure of data.
 */
export default class BufferedQueue {
    private readonly jobTimeoutSec;
    private savedState;
    private writingState?;
    private queueBuffer?;
    private queuePromised?;
    private queuedCb?;
    get isDestroyed(): boolean;
    constructor(jobTimeoutSec?: number);
    destroy(): void;
    getState(): {
        [index: string]: any;
    };
    getSavedState(): {
        [index: string]: any;
    };
    getSavingState(): {
        [index: string]: any;
    } | undefined;
    /**
     * It means only some job is pending
     */
    isPending(): boolean;
    isItemPending(key: number | string): boolean;
    /**
     * It means is pending and has queue
     */
    hasQueue(): boolean;
    stop(): void;
    clearItem(itemKey: string | number): void;
    /**
     * If you add some object or array please clone it deeply before.
     */
    add(cb: QueuedCb, partialState: {
        [index: string]: any;
    }): Promise<void>;
    private writeFirstTime;
    private startQueuedCb;
    private onSuccess;
    private clearWholeJob;
}
export {};
