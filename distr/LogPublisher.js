export class LogPublisher {
    eventHandler;
    constructor(eventHandler) {
        this.eventHandler = eventHandler;
    }
    debug(message) {
        this.eventHandler('debug', message);
    }
    log(message) {
        this.eventHandler('log', message);
    }
    info(message) {
        this.eventHandler('info', message);
    }
    warn(message) {
        this.eventHandler('warn', message);
    }
    error(message) {
        this.eventHandler('error', String(message));
    }
}
