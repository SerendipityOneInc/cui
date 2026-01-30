import { createLogger } from './logger.js';
import { ConfigService } from './config-service.js';
import { WebPushService } from './web-push-service.js';
/**
 * Service for sending push notifications via ntfy.sh
 */
export class NotificationService {
    logger;
    configService;
    machineId = null;
    webPushService;
    constructor() {
        this.logger = createLogger('NotificationService');
        this.configService = ConfigService.getInstance();
        this.webPushService = WebPushService.getInstance();
    }
    /**
     * Get machine ID from config
     */
    getMachineId() {
        if (!this.machineId) {
            try {
                const config = this.configService.getConfig();
                this.machineId = config.machine_id;
            }
            catch (error) {
                this.logger.error('Failed to get machine ID from config', error);
                this.machineId = 'unknown';
            }
        }
        return this.machineId;
    }
    /**
     * Check if notifications are enabled
     */
    async isEnabled() {
        const config = this.configService.getConfig();
        return config.interface.notifications?.enabled ?? false;
    }
    /**
     * Get the ntfy URL from preferences
     */
    async getNtfyUrl() {
        const config = this.configService.getConfig();
        return config.interface.notifications?.ntfyUrl || 'https://ntfy.sh';
    }
    /**
     * Send a notification for a permission request
     */
    async sendPermissionNotification(request, sessionId, summary) {
        if (!(await this.isEnabled())) {
            this.logger.debug('Notifications disabled, skipping permission notification');
            return;
        }
        try {
            const machineId = this.getMachineId();
            const topic = `cui-${machineId}`;
            const ntfyUrl = await this.getNtfyUrl();
            const notification = {
                title: 'CUI Permission Request',
                message: summary
                    ? `${summary} - ${request.toolName}`
                    : `${request.toolName} tool: ${JSON.stringify(request.toolInput).substring(0, 100)}...`,
                priority: 'default',
                tags: ['cui-permission'],
                sessionId: sessionId || 'unknown',
                streamingId: request.streamingId,
                permissionRequestId: request.id
            };
            // Send via ntfy
            await this.sendNotification(ntfyUrl, topic, notification);
            // Also broadcast via native web push (best-effort)
            try {
                await this.webPushService.initialize();
                if (this.webPushService.getEnabled()) {
                    await this.webPushService.broadcast({
                        title: notification.title,
                        message: notification.message,
                        tag: notification.tags[0],
                        data: {
                            sessionId: notification.sessionId,
                            streamingId: notification.streamingId,
                            permissionRequestId: notification.permissionRequestId,
                            type: 'permission',
                        },
                    });
                }
            }
            catch (err) {
                this.logger.debug('Web push broadcast failed (non-fatal)', { error: err?.message });
            }
            this.logger.info('Permission notification sent', {
                requestId: request.id,
                toolName: request.toolName,
                topic
            });
        }
        catch (error) {
            this.logger.error('Failed to send permission notification', error, {
                requestId: request.id
            });
        }
    }
    /**
     * Send a notification when a conversation ends
     */
    async sendConversationEndNotification(streamingId, sessionId, summary) {
        if (!(await this.isEnabled())) {
            this.logger.debug('Notifications disabled, skipping conversation end notification');
            return;
        }
        try {
            const machineId = this.getMachineId();
            const topic = `cui-${machineId}`;
            const ntfyUrl = await this.getNtfyUrl();
            const notification = {
                title: 'Task Finished',
                message: summary || 'Task completed',
                priority: 'default',
                tags: ['cui-complete'],
                sessionId,
                streamingId
            };
            // Send via ntfy
            await this.sendNotification(ntfyUrl, topic, notification);
            // Also broadcast via native web push (best-effort)
            try {
                await this.webPushService.initialize();
                if (this.webPushService.getEnabled()) {
                    await this.webPushService.broadcast({
                        title: notification.title,
                        message: notification.message,
                        tag: notification.tags[0],
                        data: {
                            sessionId: notification.sessionId,
                            streamingId: notification.streamingId,
                            type: 'conversation-end',
                        },
                    });
                }
            }
            catch (err) {
                this.logger.debug('Web push broadcast failed (non-fatal)', { error: err?.message });
            }
            this.logger.info('Conversation end notification sent', {
                sessionId,
                streamingId,
                topic
            });
        }
        catch (error) {
            this.logger.error('Failed to send conversation end notification', error, {
                sessionId,
                streamingId
            });
        }
    }
    /**
     * Send a notification to ntfy
     */
    async sendNotification(ntfyUrl, topic, notification) {
        const url = `${ntfyUrl}/${topic}`;
        const headers = {
            'Title': notification.title,
            'Priority': notification.priority,
            'Tags': notification.tags.join(',')
        };
        // Add custom headers for CUI metadata
        headers['X-CUI-SessionId'] = notification.sessionId;
        headers['X-CUI-StreamingId'] = notification.streamingId;
        if (notification.permissionRequestId) {
            headers['X-CUI-PermissionRequestId'] = notification.permissionRequestId;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: notification.message
        });
        if (!response.ok) {
            throw new Error(`Ntfy returned ${response.status}: ${await response.text()}`);
        }
    }
}
//# sourceMappingURL=notification-service.js.map