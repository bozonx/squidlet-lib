import { IndexedEvents } from './IndexedEvents.js';
/**
 * It is storage in memory.
 * It means that all the data will be lost on system stop.
 */
export class MemStorage {
    changeEvent = new IndexedEvents();
    storage = {};
    /**
     * If need you can init storage for example loaded from file
     */
    async initStorage(storage) {
        this.storage = storage;
    }
    async get(dir, name) {
        return this.storage[dir][name];
    }
    async getNames(dir) {
        return Object.keys(this.storage[dir]);
    }
    async set(dir, name, value) {
        if (!this.storage[dir])
            this.storage[dir] = {};
        const oldValue = this.storage[dir][name];
        this.storage[dir][name] = value;
        this.changeEvent.emit(dir, name, value, oldValue);
    }
    async remove(dir, name) {
        if (!this.storage[dir])
            return;
        const oldValue = this.storage[dir][name];
        delete this.storage[dir][name];
        this.changeEvent.emit(dir, name, undefined, oldValue);
    }
    async clear(dir) {
        const oldDir = this.storage[dir];
        delete this.storage[dir];
        for (const name of Object.keys(oldDir)) {
            this.changeEvent.emit(dir, name, undefined, oldDir[name]);
        }
    }
}
