import { PermissionRequest } from '../types/index.js';
export interface Notification {
    title: string;
    message: string;
    priority: 'min' | 'low' | 'default' | 'high' | 'urgent';
    tags: string[];
    sessionId: string;
    streamingId: string;
    permissionRequestId?: string;
}
/**
 * Service for sending push notifications via ntfy.sh
 */
export declare class NotificationService {
    private logger;
    private configService;
    private machineId;
    private webPushService;
    constructor();
    /**
     * Get machine ID from config
     */
    private getMachineId;
    /**
     * Check if notifications are enabled
     */
    private isEnabled;
    /**
     * Get the ntfy URL from preferences
     */
    private getNtfyUrl;
    /**
     * Send a notification for a permission request
     */
    sendPermissionNotification(request: PermissionRequest, sessionId?: string, summary?: string): Promise<void>;
    /**
     * Send a notification when a conversation ends
     */
    sendConversationEndNotification(streamingId: string, sessionId: string, summary?: string): Promise<void>;
    /**
     * Send a notification to ntfy
     */
    private sendNotification;
}
//# sourceMappingURL=notification-service.d.ts.map