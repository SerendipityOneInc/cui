import { EventEmitter } from 'events';
import { ToolMetrics } from '../types/index.js';
import Anthropic from '@anthropic-ai/sdk';
/**
 * Service for tracking tool usage metrics from Claude CLI conversations
 * Listens to 'claude-message' events and calculates line diff statistics
 */
export declare class ToolMetricsService extends EventEmitter {
    private metrics;
    private logger;
    constructor();
    /**
     * Start listening to messages from ClaudeProcessManager
     */
    listenToClaudeMessages(processManager: EventEmitter): void;
    /**
     * Get metrics for a specific session
     */
    getMetrics(sessionId: string): ToolMetrics | undefined;
    /**
     * Handle Claude messages to extract tool use data
     */
    private handleClaudeMessage;
    /**
     * Process assistant messages to find tool use blocks
     */
    private processAssistantMessage;
    /**
     * Process a tool use block to calculate line diffs
     */
    private processToolUse;
    /**
     * Calculate line diff for an edit operation using proper diff algorithm
     */
    private calculateEditLineDiff;
    /**
     * Count lines in a string
     */
    private countLines;
    /**
     * Calculate metrics from historical conversation messages
     * This is used by ClaudeHistoryReader for past conversations
     */
    calculateMetricsFromMessages(messages: Array<{
        type: string;
        message?: Anthropic.Message | Anthropic.MessageParam;
    }>): ToolMetrics;
    /**
     * Process tool use for direct metrics calculation (used for historical data)
     */
    private processToolUseForMetrics;
}
//# sourceMappingURL=ToolMetricsService.d.ts.map