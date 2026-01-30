import { Router } from 'express';
import { createLogger } from '../services/logger.js';
export function createConfigRoutes(service) {
    const router = Router();
    const logger = createLogger('ConfigRoutes');
    router.get('/', (req, res, next) => {
        try {
            res.json(service.getConfig());
        }
        catch (error) {
            logger.error('Failed to get config', error);
            next(error);
        }
    });
    router.put('/', async (req, res, next) => {
        try {
            await service.updateConfig(req.body);
            res.json(service.getConfig());
        }
        catch (error) {
            logger.error('Failed to update config', error);
            next(error);
        }
    });
    return router;
}
//# sourceMappingURL=config.routes.js.map