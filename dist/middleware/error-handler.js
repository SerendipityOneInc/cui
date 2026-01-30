import { CUIError } from '../types/index.js';
import { createLogger } from '../services/logger.js';
const logger = createLogger('ErrorHandler');
export function errorHandler(err, req, res, _next) {
    const requestId = req.requestId || 'unknown';
    if (err instanceof CUIError) {
        logger.warn('CUIError in request', {
            requestId,
            code: err.code,
            message: err.message,
            statusCode: err.statusCode,
            url: req.url,
            method: req.method
        });
        res.status(err.statusCode).json({ error: err.message, code: err.code });
    }
    else {
        logger.error('Unhandled error', err, {
            requestId,
            url: req.url,
            method: req.method,
            errorType: err.constructor.name
        });
        res.status(500).json({ error: 'Internal server error' });
    }
}
//# sourceMappingURL=error-handler.js.map