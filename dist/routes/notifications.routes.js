import { Router } from 'express';
import { createLogger } from '../services/logger.js';
export function createNotificationsRoutes(webPush) {
    const router = Router();
    const logger = createLogger('NotificationsRoutes');
    // Status: enabled, subscriptionCount, publicKey presence
    router.get('/status', async (req, res) => {
        await webPush.initialize();
        res.json({
            enabled: webPush.getEnabled(),
            subscriptionCount: webPush.getSubscriptionCount(),
            hasPublicKey: !!webPush.getPublicKey(),
            publicKey: webPush.getPublicKey() || undefined,
        });
    });
    // Register a subscription
    router.post('/register', async (req, res, next) => {
        try {
            await webPush.initialize();
            const subscription = req.body;
            if (!subscription || !subscription.endpoint) {
                res.status(400).json({ error: 'Invalid subscription' });
                return;
            }
            const userAgent = req.get('user-agent') || '';
            webPush.addOrUpdateSubscription(subscription, userAgent);
            res.json({ success: true });
        }
        catch (error) {
            logger.error('Failed to register subscription', error);
            next(error);
        }
    });
    // Unregister by endpoint
    router.post('/unregister', async (req, res, next) => {
        try {
            await webPush.initialize();
            const { endpoint } = req.body || {};
            if (!endpoint) {
                res.status(400).json({ error: 'endpoint is required' });
                return;
            }
            webPush.removeSubscriptionByEndpoint(endpoint);
            res.json({ success: true });
        }
        catch (error) {
            logger.error('Failed to unregister subscription', error);
            next(error);
        }
    });
    // Send test notification
    router.post('/test', async (req, res, next) => {
        try {
            await webPush.initialize();
            const { title, message, tag, data } = req.body || {};
            const result = await webPush.broadcast({
                title: title || 'CUI Test',
                message: message || 'This is a test notification',
                tag: tag || 'cui-test',
                data: data || {},
            });
            res.json({ success: true, ...result });
        }
        catch (error) {
            logger.error('Failed to send test notification', error);
            next(error);
        }
    });
    return router;
}
//# sourceMappingURL=notifications.routes.js.map