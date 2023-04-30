export type AnyHandler = (...args: any[]) => void;
export declare class IndexedEvents<T extends AnyHandler> {
    private handlers;
    /**
     * Get all the handlers.
     * Removed handlers will be undefined
     */
    getListeners(): (T | undefined)[];
    hasListeners(): boolean;
    emit: T;
    emitSync: (...args: any[]) => Promise<void>;
    emitAll: (...args: any[]) => Promise<void>;
    /**
     * Register listener and return its index.
     */
    addListener(handler: T): number;
    once(handler: T): number;
    removeListener(handlerIndex: number): void;
    removeAll(): void;
    destroy(): void;
}
