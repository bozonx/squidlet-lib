export declare class CError extends Error {
    readonly code: number;
    readonly message: string;
    constructor(code: number, message: string);
}
