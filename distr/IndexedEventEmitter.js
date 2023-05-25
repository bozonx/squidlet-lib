import { isPromise } from './common.js';
export class IndexedEventEmitter {
    // all the handlers by index, removed handlers are empty
    handlers = [];
    // indexes by event names
    indexes = {};
    // TODO: test
    get isDestroyed() {
        return typeof this.handlers === 'undefined' && typeof this.indexes === 'undefined';
    }
    emit = (eventName, ...args) => {
        if (!this.indexes[eventName])
            return;
        // make clone of indexes because some indexes are able be removed while processing "once" events
        const indexes = [...this.indexes[eventName]];
        for (let index of indexes) {
            const handler = this.handlers[index];
            // TODO: test
            if (!handler) {
                throw new Error(`IndexedEventEmitter.emit: can't find handler of event "${eventName}" by index "${index}"`);
            }
            handler(...args);
        }
    };
    emitSync = async (eventName, ...args) => {
        if (!this.indexes[eventName])
            return;
        // make clone of indexes because some indexes are able be removed while processing "once" events
        const indexes = [...this.indexes[eventName]];
        for (let index of indexes) {
            const handler = this.handlers[index];
            // TODO: test
            if (!handler) {
                throw new Error(`IndexedEventEmitter.emitSync: can't find handler of event "${eventName}" by index "${index}"`);
            }
            await handler(...args);
        }
    };
    // TODO: можно сделать вариант когда выполняются все, ошибочные пропускаются и выводятся ошибки списокм
    // TODO: test
    // TODO: review
    emitAll = async (eventName, ...args) => {
        if (!this.indexes[eventName])
            return;
        const promises = [];
        // TODO: не будет рабоать ?????
        // TODO: делать клон индексов
        for (let index of this.indexes[eventName]) {
            const handler = this.handlers[index];
            // TODO: test
            if (!handler) {
                throw new Error(`IndexedEventEmitter.emitAll: can't find handler of event "${eventName}" by index "${index}"`);
            }
            const result = handler(...args);
            if (isPromise(result)) {
                promises.push(result);
            }
        }
        await Promise.all(promises);
    };
    once(eventName, handler) {
        let wrapperIndex;
        const wrapper = ((...args) => {
            this.removeListener(wrapperIndex, eventName);
            // return in promise case
            // TODO: что если произойдет ошибка ???
            return handler(...args);
        });
        wrapperIndex = this.addListener(eventName, wrapper);
        return wrapperIndex;
    }
    /**
     * Register listener and return its index
     */
    addListener(eventName, handler) {
        if (!this.indexes[eventName]) {
            this.indexes[eventName] = [];
        }
        const index = this.handlers.length;
        this.handlers.push(handler);
        this.indexes[eventName].push(index);
        return index;
    }
    getListeners(eventName) {
        if (!this.indexes[eventName])
            return [];
        const result = [];
        for (let index of this.indexes[eventName]) {
            const handler = this.handlers[index];
            // TODO: test
            if (!handler) {
                throw new Error(`IndexedEventEmitter.getListeners: can't find handler of event "${eventName}" by index "${index}"`);
            }
            result.push(handler);
        }
        return result;
    }
    hasListeners(eventName) {
        return Boolean(this.indexes[eventName] && this.indexes[eventName].length);
    }
    /**
     * Remove handler by index.
     * You can omit eventName, but if you defined it then removing will be faster.
     */
    removeListener(handlerIndex, eventName) {
        // TODO: проверить что после дестроя не будет поднимать ошибки
        if (typeof handlerIndex === 'undefined')
            return;
        if (typeof eventName !== 'undefined') {
            if (!this.indexes[eventName])
                return;
            // find index of handler index in list belongs to eventName
            const foundIndexInEvents = this.indexes[eventName].findIndex((item) => item === handlerIndex);
            if (foundIndexInEvents < 0)
                return;
            this.indexes[eventName].splice(foundIndexInEvents, 1);
            // remove event's array if it is empty
            if (!this.indexes[eventName].length) {
                delete this.indexes[eventName];
            }
            delete this.handlers[handlerIndex];
            return;
        }
        // TODO: если не указан eventName - то не работает
        // find the event name and remove it's index.
        for (let eventName of Object.keys(this.indexes)) {
            const found = this.indexes[eventName].find((item) => item === handlerIndex);
            if (typeof found === 'undefined')
                continue;
            // found
            this.indexes[eventName].splice(handlerIndex, 1);
            if (!this.indexes[eventName].length)
                delete this.indexes[eventName];
            delete this.handlers[handlerIndex];
            return;
        }
    }
    removeAllListeners(eventName) {
        if (!this.indexes[eventName])
            return;
        for (let index of this.indexes[eventName]) {
            delete this.handlers[index];
        }
        delete this.indexes[eventName];
    }
    destroy() {
        // @ts-ignore
        delete this.handlers;
        // @ts-ignore
        delete this.indexes;
    }
}
