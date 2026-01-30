import { EventEmitter } from 'events';
import { ConversationSummary, ConversationMessage, ConversationDetailsResponse } from '../types/index.js';
/**
 * Context data stored for active conversations that have not yet been written to local directories
 */
export interface ConversationStatusContext {
    initialPrompt: string;
    workingDirectory: string;
    model: string;
    timestamp: string;
    inheritedMessages?: ConversationMessage[];
}
/**
 * Unified service for managing conversation status and tracking active session status.
 * This service combines the functionality of ConversationStatusTracker and optimistic conversation handling.
 *
 * Responsibilities:
 * - Track active streaming sessions and their Claude session IDs
 * - Store conversation status contexts for active sessions
 * - Generate optimistic conversation summaries and details for UI feedback
 * - Emit events for session lifecycle (started/ended)
 */
export declare class ConversationStatusManager extends EventEmitter {
    private sessionToStreaming;
    private streamingToSession;
    private sessionContext;
    private logger;
    constructor();
    /**
     * Register a new active streaming session with optional conversation context
     * This is called when we extract the session_id from the first stream message
     */
    registerActiveSession(streamingId: string, claudeSessionId: string, conversationContext?: {
        initialPrompt: string;
        workingDirectory: string;
        model?: string;
        inheritedMessages?: ConversationMessage[];
    }): void;
    /**
     * Unregister an active streaming session when it ends
     */
    unregisterActiveSession(streamingId: string): void;
    /**
     * Get conversation context for an active session
     */
    getConversationContext(claudeSessionId: string): ConversationStatusContext | undefined;
    /**
     * Check if a Claude session ID is currently active (has ongoing stream)
     */
    isSessionActive(claudeSessionId: string): boolean;
    /**
     * Get the streaming ID for an active Claude session
     */
    getStreamingId(claudeSessionId: string): string | undefined;
    /**
     * Get the Claude session ID for an active streaming session
     */
    getSessionId(streamingId: string): string | undefined;
    /**
     * Get all active Claude session IDs
     */
    getActiveSessionIds(): string[];
    /**
     * Get all active streaming IDs
     */
    getActiveStreamingIds(): string[];
    /**
     * Get conversation status for a Claude session ID
     */
    getConversationStatus(claudeSessionId: string): 'completed' | 'ongoing' | 'pending';
    /**
     * Get conversations that haven't appeared in history yet
     * Used by the conversation list endpoint
     */
    getConversationsNotInHistory(existingSessionIds: Set<string>): ConversationSummary[];
    /**
     * Get conversation details if session is active but not in history
     * Used by the conversation details endpoint
     */
    getActiveConversationDetails(sessionId: string): ConversationDetailsResponse | null;
    /**
     * Clear all mappings (useful for testing)
     */
    clear(): void;
    /**
     * Get statistics about tracked sessions
     */
    getStats(): {
        activeSessionsCount: number;
        activeStreamingIdsCount: number;
        activeContextsCount: number;
        activeSessions: Array<{
            claudeSessionId: string;
            streamingId: string;
        }>;
    };
}
//# sourceMappingURL=conversation-status-manager.d.ts.map