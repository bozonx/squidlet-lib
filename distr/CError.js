export class CError extends Error {
    code;
    message;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
        // @ts-ignore
        this.__proto__.toString = () => `Code ${this.code}. ${this.message}`;
    }
}
