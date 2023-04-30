import { IndexedEvents } from './IndexedEvents.js';
type ChangeEventHandler = (dir: string, name: string, value: any, oldValue: any) => void;
export interface MemStorageBase {
    readonly changeEvent: IndexedEvents<ChangeEventHandler>;
    initStorage(storage: Record<string, Record<string, any>>): Promise<void>;
    get(dir: string, name: string): Promise<any>;
    getNames(dir: string): Promise<string[]>;
    set(dir: string, name: string, value: any): Promise<void>;
    remove(dir: string, name: string): Promise<void>;
    clear(dir: string): Promise<void>;
}
/**
 * It is storage in memory.
 * It means that all the data will be lost on system stop.
 */
export declare class MemStorage implements MemStorageBase {
    readonly changeEvent: IndexedEvents<ChangeEventHandler>;
    private storage;
    /**
     * If need you can init storage for example loaded from file
     */
    initStorage(storage: Record<string, Record<string, any>>): Promise<void>;
    get(dir: string, name: string): Promise<any>;
    getNames(dir: string): Promise<string[]>;
    set(dir: string, name: string, value: any): Promise<void>;
    remove(dir: string, name: string): Promise<void>;
    clear(dir: string): Promise<void>;
}
export {};
