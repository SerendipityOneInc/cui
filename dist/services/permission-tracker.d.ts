import { EventEmitter } from 'events';
import { PermissionRequest } from '../types/index.js';
import { NotificationService } from './notification-service.js';
import { ConversationStatusManager } from './conversation-status-manager.js';
import { ClaudeHistoryReader } from './claude-history-reader.js';
/**
 * Service to track permission requests from Claude CLI via MCP
 */
export declare class PermissionTracker extends EventEmitter {
    private permissionRequests;
    private notificationService?;
    private conversationStatusManager?;
    private historyReader?;
    constructor();
    /**
     * Set the notification service
     */
    setNotificationService(service: NotificationService): void;
    /**
     * Set the conversation status manager
     */
    setConversationStatusManager(manager: ConversationStatusManager): void;
    /**
     * Set the history reader
     */
    setHistoryReader(reader: ClaudeHistoryReader): void;
    /**
     * Add a new permission request
     */
    addPermissionRequest(toolName: string, toolInput: Record<string, unknown>, streamingId?: string): PermissionRequest;
    /**
     * Get all permission requests
     */
    getAllPermissionRequests(): PermissionRequest[];
    /**
     * Get permission requests filtered by criteria
     */
    getPermissionRequests(filter?: {
        streamingId?: string;
        status?: 'pending' | 'approved' | 'denied';
    }): PermissionRequest[];
    /**
     * Get a specific permission request by ID
     */
    getPermissionRequest(id: string): PermissionRequest | undefined;
    /**
     * Update permission request status (for future use when we implement approval/denial)
     */
    updatePermissionStatus(id: string, status: 'approved' | 'denied', options?: {
        modifiedInput?: Record<string, unknown>;
        denyReason?: string;
    }): boolean;
    /**
     * Clear all permission requests (for testing)
     */
    clear(): void;
    /**
     * Get the number of permission requests
     */
    size(): number;
    /**
     * Remove all permissions for a specific streaming ID
     * Used for cleanup when a conversation ends
     */
    removePermissionsByStreamingId(streamingId: string): number;
}
//# sourceMappingURL=permission-tracker.d.ts.map