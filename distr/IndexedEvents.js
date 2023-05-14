import { isPromise } from './common.js';
export class IndexedEvents {
    // all the handlers by index, removed handlers are empty
    handlers = [];
    /**
     * Get all the handlers.
     * Removed handlers will be undefined
     */
    getListeners() {
        return this.handlers;
    }
    hasListeners() {
        return Boolean(this.handlers.length);
    }
    emit = ((...args) => {
        for (let handler of this.handlers) {
            if (handler)
                handler(...args);
        }
    });
    emitSync = async (...args) => {
        for (let handler of this.handlers) {
            if (!handler)
                continue;
            await handler(...args);
        }
    };
    // TODO: можно сделать вариант когда выполняются все, ошибочные пропускаются и выводятся ошибки списокм
    // TODO: test
    emitAll = async (...args) => {
        const promises = [];
        for (let handler of this.handlers) {
            if (!handler)
                continue;
            const result = handler(...args);
            if (isPromise(result)) {
                promises.push(result);
            }
        }
        return Promise.all(promises).then(() => undefined);
    };
    /**
     * Register listener and return its index.
     */
    addListener(handler) {
        this.handlers.push(handler);
        return this.handlers.length - 1;
    }
    once(handler) {
        let wrapperIndex;
        const wrapper = ((...args) => {
            this.removeListener(wrapperIndex);
            // return in promise case
            return handler(...args);
        });
        wrapperIndex = this.addListener(wrapper);
        return wrapperIndex;
    }
    removeListener(handlerIndex) {
        if (typeof handlerIndex === 'undefined')
            return;
        else if (!this.handlers[handlerIndex])
            return;
        delete this.handlers[handlerIndex];
    }
    removeAll() {
        this.handlers.splice(0, this.handlers.length);
    }
    destroy() {
        // @ts-ignore
        delete this.handlers;
    }
}
