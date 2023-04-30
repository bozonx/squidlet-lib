export type DefaultHandler = (...args: any[]) => void;
export declare class IndexedEventEmitter<T extends DefaultHandler = DefaultHandler> {
    private handlers;
    private indexes;
    get isDestroyed(): boolean;
    emit: (eventName: string | number, ...args: any[]) => void;
    emitSync: (eventName: string | number, ...args: any[]) => Promise<void>;
    emitAll: (eventName: string | number, ...args: any[]) => Promise<void>;
    once(eventName: string | number, handler: T): number;
    /**
     * Register listener and return its index
     */
    addListener(eventName: string | number, handler: T): number;
    getListeners(eventName: string | number): T[];
    hasListeners(eventName: string | number): boolean;
    /**
     * Remove handler by index.
     * You can omit eventName, but if you defined it then removing will be faster.
     */
    removeListener(handlerIndex: number, eventName?: string | number): void;
    removeAllListeners(eventName: string | number): void;
    destroy(): void;
}
