// Error types
export class CUIError extends Error {
    code;
    statusCode;
    constructor(code, message, statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'CUIError';
    }
}
export * from './config.js';
export * from './router-config.js';
//# sourceMappingURL=index.js.map