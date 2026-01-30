import { EventEmitter } from 'events';
import { createLogger } from './logger.js';
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
export class ConversationStatusManager extends EventEmitter {
    // Maps Claude session ID -> CUI streaming ID
    sessionToStreaming = new Map();
    // Maps CUI streaming ID -> Claude session ID (reverse lookup)
    streamingToSession = new Map();
    // Maps Claude session ID -> conversation context for active sessions
    sessionContext = new Map();
    logger;
    constructor() {
        super();
        this.logger = createLogger('ConversationStatusManager');
    }
    /**
     * Register a new active streaming session with optional conversation context
     * This is called when we extract the session_id from the first stream message
     */
    registerActiveSession(streamingId, claudeSessionId, conversationContext) {
        this.logger.debug('Registering active session', {
            streamingId,
            claudeSessionId,
            hasConversationContext: !!conversationContext
        });
        // Remove any existing mapping for this Claude session
        const existingStreamingId = this.sessionToStreaming.get(claudeSessionId);
        if (existingStreamingId && existingStreamingId !== streamingId) {
            this.logger.debug('Removing existing mapping for Claude session', {
                claudeSessionId,
                oldStreamingId: existingStreamingId,
                newStreamingId: streamingId
            });
            this.streamingToSession.delete(existingStreamingId);
        }
        // Remove any existing mapping for this streaming ID
        const existingClaudeSessionId = this.streamingToSession.get(streamingId);
        if (existingClaudeSessionId && existingClaudeSessionId !== claudeSessionId) {
            this.logger.debug('Removing existing mapping for streaming ID', {
                streamingId,
                oldClaudeSessionId: existingClaudeSessionId,
                newClaudeSessionId: claudeSessionId
            });
            this.sessionToStreaming.delete(existingClaudeSessionId);
            this.sessionContext.delete(existingClaudeSessionId);
        }
        // Set the new mapping
        this.sessionToStreaming.set(claudeSessionId, streamingId);
        this.streamingToSession.set(streamingId, claudeSessionId);
        // If conversation context is provided, store it immediately
        if (conversationContext) {
            const context = {
                initialPrompt: conversationContext.initialPrompt,
                workingDirectory: conversationContext.workingDirectory,
                model: conversationContext.model || 'default',
                timestamp: new Date().toISOString(),
                inheritedMessages: conversationContext.inheritedMessages
            };
            this.sessionContext.set(claudeSessionId, context);
            this.logger.debug('Stored conversation status context', {
                claudeSessionId,
                hasInitialPrompt: !!context.initialPrompt,
                workingDirectory: context.workingDirectory,
                model: context.model,
                inheritedMessageCount: context.inheritedMessages?.length || 0
            });
        }
        this.logger.debug('Active session registered', {
            streamingId,
            claudeSessionId,
            totalActiveSessions: this.sessionToStreaming.size,
            hasConversationContext: !!conversationContext
        });
        this.emit('session-started', { streamingId, claudeSessionId });
    }
    /**
     * Unregister an active streaming session when it ends
     */
    unregisterActiveSession(streamingId) {
        const claudeSessionId = this.streamingToSession.get(streamingId);
        if (claudeSessionId) {
            this.logger.debug('Unregistering active session', {
                streamingId,
                claudeSessionId
            });
            this.sessionToStreaming.delete(claudeSessionId);
            this.streamingToSession.delete(streamingId);
            this.sessionContext.delete(claudeSessionId);
            this.logger.info('Active session unregistered', {
                streamingId,
                claudeSessionId,
                totalActiveSessions: this.sessionToStreaming.size
            });
            this.emit('session-ended', { streamingId, claudeSessionId });
        }
        else {
            this.logger.debug('Attempted to unregister unknown streaming session', { streamingId });
        }
    }
    /**
     * Get conversation context for an active session
     */
    getConversationContext(claudeSessionId) {
        const context = this.sessionContext.get(claudeSessionId);
        this.logger.debug('Getting conversation context', {
            claudeSessionId,
            hasContext: !!context
        });
        return context;
    }
    /**
     * Check if a Claude session ID is currently active (has ongoing stream)
     */
    isSessionActive(claudeSessionId) {
        const isActive = this.sessionToStreaming.has(claudeSessionId);
        return isActive;
    }
    /**
     * Get the streaming ID for an active Claude session
     */
    getStreamingId(claudeSessionId) {
        const streamingId = this.sessionToStreaming.get(claudeSessionId);
        this.logger.debug('Getting streaming ID for Claude session', {
            claudeSessionId,
            streamingId: streamingId || 'not found'
        });
        return streamingId;
    }
    /**
     * Get the Claude session ID for an active streaming session
     */
    getSessionId(streamingId) {
        const claudeSessionId = this.streamingToSession.get(streamingId);
        this.logger.debug('Getting Claude session ID for streaming ID', {
            streamingId,
            claudeSessionId: claudeSessionId || 'not found'
        });
        return claudeSessionId;
    }
    /**
     * Get all active Claude session IDs
     */
    getActiveSessionIds() {
        const sessions = Array.from(this.sessionToStreaming.keys());
        this.logger.debug('Getting all active session IDs', {
            count: sessions.length,
            sessions
        });
        return sessions;
    }
    /**
     * Get all active streaming IDs
     */
    getActiveStreamingIds() {
        const streamingIds = Array.from(this.streamingToSession.keys());
        this.logger.debug('Getting all active streaming IDs', {
            count: streamingIds.length,
            streamingIds
        });
        return streamingIds;
    }
    /**
     * Get conversation status for a Claude session ID
     */
    getConversationStatus(claudeSessionId) {
        const isActive = this.isSessionActive(claudeSessionId);
        const status = isActive ? 'ongoing' : 'completed';
        return status;
    }
    /**
     * Get conversations that haven't appeared in history yet
     * Used by the conversation list endpoint
     */
    getConversationsNotInHistory(existingSessionIds) {
        const activeSessionIds = this.getActiveSessionIds();
        const conversationsNotInHistory = activeSessionIds
            .filter(sessionId => !existingSessionIds.has(sessionId))
            .map(sessionId => {
            const context = this.getConversationContext(sessionId);
            const streamingId = this.getStreamingId(sessionId);
            if (context && streamingId) {
                // Create conversation entry for active session
                const conversationSummary = {
                    sessionId,
                    projectPath: context.workingDirectory,
                    summary: '', // No summary for active conversation
                    sessionInfo: {
                        custom_name: '', // No custom name yet
                        created_at: context.timestamp,
                        updated_at: context.timestamp,
                        version: 4,
                        pinned: false,
                        archived: false,
                        continuation_session_id: '',
                        initial_commit_head: '',
                        permission_mode: 'default'
                    },
                    createdAt: context.timestamp,
                    updatedAt: context.timestamp,
                    messageCount: 1, // At least the initial user message
                    totalDuration: 0, // No duration yet
                    model: context.model || 'unknown',
                    status: 'ongoing',
                    streamingId
                };
                this.logger.debug('Created conversation summary for active session', {
                    sessionId,
                    streamingId,
                    workingDirectory: context.workingDirectory,
                    model: context.model
                });
                return conversationSummary;
            }
            return null;
        })
            .filter((conversation) => conversation !== null);
        this.logger.debug('Generated conversations not in history', {
            activeSessionCount: activeSessionIds.length,
            existingSessionCount: existingSessionIds.size,
            conversationsNotInHistoryCount: conversationsNotInHistory.length
        });
        return conversationsNotInHistory;
    }
    /**
     * Get conversation details if session is active but not in history
     * Used by the conversation details endpoint
     */
    getActiveConversationDetails(sessionId) {
        const isActive = this.isSessionActive(sessionId);
        const context = this.getConversationContext(sessionId);
        this.logger.debug('Checking for active conversation details', {
            sessionId,
            isActive,
            hasContext: !!context
        });
        if (!isActive || !context) {
            return null;
        }
        // Create messages array
        const messages = [];
        // Add inherited messages first (if any)
        if (context.inheritedMessages) {
            messages.push(...context.inheritedMessages);
        }
        // Add the current initial prompt message
        const activeMessage = {
            uuid: `active-${sessionId}-user`,
            type: 'user',
            message: {
                role: 'user',
                content: context.initialPrompt
            },
            timestamp: context.timestamp,
            sessionId: sessionId,
            cwd: context.workingDirectory
        };
        messages.push(activeMessage);
        const response = {
            messages,
            summary: '', // No summary for active conversation
            projectPath: context.workingDirectory,
            metadata: {
                totalDuration: 0,
                model: context.model || 'unknown'
            }
        };
        this.logger.debug('Created active conversation details', {
            sessionId,
            workingDirectory: context.workingDirectory,
            model: context.model,
            totalMessageCount: messages.length,
            inheritedMessageCount: context.inheritedMessages?.length || 0
        });
        return response;
    }
    /**
     * Clear all mappings (useful for testing)
     */
    clear() {
        this.logger.debug('Clearing all session mappings');
        this.sessionToStreaming.clear();
        this.streamingToSession.clear();
        this.sessionContext.clear();
    }
    /**
     * Get statistics about tracked sessions
     */
    getStats() {
        const activeSessions = Array.from(this.sessionToStreaming.entries()).map(([claudeSessionId, streamingId]) => ({ claudeSessionId, streamingId }));
        return {
            activeSessionsCount: this.sessionToStreaming.size,
            activeStreamingIdsCount: this.streamingToSession.size,
            activeContextsCount: this.sessionContext.size,
            activeSessions
        };
    }
}
//# sourceMappingURL=conversation-status-manager.js.map