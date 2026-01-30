import { ConversationSummary, ConversationMessage, ConversationListQuery } from '../types/index.js';
import { SessionInfoService } from './session-info-service.js';
/**
 * Reads conversation history from Claude's local storage
 */
export declare class ClaudeHistoryReader {
    private claudeHomePath;
    private logger;
    private sessionInfoService;
    private conversationCache;
    private toolMetricsService;
    private messageFilter;
    constructor(sessionInfoService?: SessionInfoService);
    get homePath(): string;
    /**
     * Clear the conversation cache to force a refresh on next read
     */
    clearCache(): void;
    /**
     * List all conversations with optional filtering
     */
    listConversations(filter?: ConversationListQuery): Promise<{
        conversations: ConversationSummary[];
        total: number;
    }>;
    /**
     * Fetch full conversation details
     */
    fetchConversation(sessionId: string): Promise<ConversationMessage[]>;
    /**
     * Get conversation metadata
     */
    getConversationMetadata(sessionId: string): Promise<{
        summary: string;
        projectPath: string;
        model: string;
        totalDuration: number;
    } | null>;
    /**
     * Get the working directory for a specific conversation session
     */
    getConversationWorkingDirectory(sessionId: string): Promise<string | null>;
    /**
     * Get file modification times for all JSONL files
     */
    private getFileModificationTimes;
    /**
     * Extract source project name from file path
     */
    private extractSourceProject;
    /**
     * Process all entries into conversation chains (the cheap in-memory operations)
     */
    private processAllEntries;
    /**
     * Parse all conversations from all JSONL files with file-level caching and concurrency protection
     */
    private parseAllConversations;
    /**
     * Parse a single JSONL file and return all valid entries
     */
    private parseJsonlFile;
    /**
     * Group entries by sessionId
     */
    private groupEntriesBySession;
    /**
     * Process summary entries and create leafUuid mapping
     */
    private processSummaries;
    private readDirectory;
    /**
     * Build a conversation chain from session entries
     */
    private buildConversationChain;
    /**
     * Build ordered message chain using parentUuid relationships
     */
    private buildMessageChain;
    /**
     * Determine conversation summary from messages and summary map
     */
    private determineConversationSummary;
    /**
     * Extract text content from message object
     */
    private extractMessageContent;
    /**
     * Extract model information from messages
     */
    private extractModel;
    private parseMessage;
    private applyFilters;
    private applyPagination;
    private decodeProjectPath;
}
//# sourceMappingURL=claude-history-reader.d.ts.map