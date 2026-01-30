import { Router } from 'express';
import { createLogger } from '../services/logger.js';
export function createStreamingRoutes(streamManager) {
    const router = Router();
    const logger = createLogger('StreamingRoutes');
    router.get('/:streamingId', (req, res) => {
        const { streamingId } = req.params;
        const requestId = req.requestId;
        logger.debug('Stream connection request', {
            requestId,
            streamingId,
            headers: {
                'accept': req.headers.accept,
                'user-agent': req.headers['user-agent']
            }
        });
        streamManager.addClient(streamingId, res);
        // Log when stream closes
        res.on('close', () => {
            logger.debug('Stream connection closed', {
                requestId,
                streamingId
            });
        });
    });
    return router;
}
//# sourceMappingURL=streaming.routes.js.map