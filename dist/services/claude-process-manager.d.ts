import { ConversationConfig, SystemInitMessage } from '../types/index.js';
import { EventEmitter } from 'events';
import { ClaudeHistoryReader } from './claude-history-reader.js';
import { ConversationStatusManager } from './conversation-status-manager.js';
import { ToolMetricsService } from './ToolMetricsService.js';
import { SessionInfoService } from './session-info-service.js';
import { FileSystemService } from './file-system-service.js';
import { NotificationService } from './notification-service.js';
import { ClaudeRouterService } from './claude-router-service.js';
/**
 * Manages Claude CLI processes and their lifecycle
 */
export declare class ClaudeProcessManager extends EventEmitter {
    private processes;
    private outputBuffers;
    private timeouts;
    private conversationConfigs;
    private claudeExecutablePath;
    private logger;
    private envOverrides;
    private historyReader;
    private mcpConfigPath?;
    private statusTracker;
    private conversationStatusManager?;
    private toolMetricsService?;
    private sessionInfoService?;
    private fileSystemService?;
    private notificationService?;
    private routerService?;
    constructor(historyReader: ClaudeHistoryReader, statusTracker: ConversationStatusManager, claudeExecutablePath?: string, envOverrides?: Record<string, string | undefined>, toolMetricsService?: ToolMetricsService, sessionInfoService?: SessionInfoService, fileSystemService?: FileSystemService);
    setRouterService(service?: ClaudeRouterService): void;
    /**
     * Find the Claude executable from node_modules
     * Since @anthropic-ai/claude-code is a dependency, claude should be in node_modules/.bin
     */
    private findClaudeExecutable;
    /**
     * Set the MCP config path to be used for all conversations
     */
    setMCPConfigPath(path: string): void;
    /**
     * Set the optimistic conversation service
     */
    setConversationStatusManager(service: ConversationStatusManager): void;
    /**
     * Set the notification service
     */
    setNotificationService(service: NotificationService): void;
    /**
     * Start a new Claude conversation (or resume if resumedSessionId is provided)
     */
    startConversation(config: ConversationConfig & {
        resumedSessionId?: string;
    }): Promise<{
        streamingId: string;
        systemInit: SystemInitMessage;
    }>;
    /**
     * Stop a conversation
     */
    stopConversation(streamingId: string): Promise<boolean>;
    /**
     * Get active sessions
     */
    getActiveSessions(): string[];
    /**
     * Check if a session is active
     */
    isSessionActive(streamingId: string): boolean;
    /**
     * Wait for the system init message from Claude CLI
     * This should always be the first message in the stream
     */
    waitForSystemInit(streamingId: string): Promise<SystemInitMessage>;
    /**
     * Execute common conversation flow for both start and resume operations
     */
    private executeConversationFlow;
    private buildBaseArgs;
    private buildResumeArgs;
    private buildStartArgs;
    /**
     * Consolidated method to spawn Claude processes for both start and resume operations
     */
    private spawnProcess;
    private setupProcessHandlers;
    private handleClaudeMessage;
    private handleProcessClose;
    private handleProcessError;
}
//# sourceMappingURL=claude-process-manager.d.ts.map