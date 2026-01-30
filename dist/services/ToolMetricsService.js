import { EventEmitter } from 'events';
import { createLogger } from './logger.js';
import { diffLines } from 'diff';
/**
 * Service for tracking tool usage metrics from Claude CLI conversations
 * Listens to 'claude-message' events and calculates line diff statistics
 */
export class ToolMetricsService extends EventEmitter {
    metrics = new Map();
    logger;
    constructor() {
        super();
        this.logger = createLogger('ToolMetricsService');
    }
    /**
     * Start listening to messages from ClaudeProcessManager
     */
    listenToClaudeMessages(processManager) {
        processManager.on('claude-message', ({ streamingId, message }) => {
            this.logger.debug('Received claude-message in ToolMetricsService', {
                streamingId,
                messageType: message?.type,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sessionId: message?.session_id
            });
            this.handleClaudeMessage(streamingId, message);
        });
        this.logger.debug('Started listening to claude-message events');
    }
    /**
     * Get metrics for a specific session
     */
    getMetrics(sessionId) {
        const metrics = this.metrics.get(sessionId);
        return metrics;
    }
    /**
     * Handle Claude messages to extract tool use data
     */
    handleClaudeMessage(streamingId, message) {
        // We're interested in assistant messages that contain tool use
        if (message.type === 'assistant') {
            const assistantMessage = message;
            this.processAssistantMessage(streamingId, assistantMessage);
        }
    }
    /**
     * Process assistant messages to find tool use blocks
     */
    processAssistantMessage(streamingId, message) {
        this.logger.debug('Processing assistant message', {
            streamingId,
            sessionId: message.session_id,
            hasMessage: !!message.message,
            hasContent: !!message.message?.content,
            contentType: Array.isArray(message.message?.content) ? 'array' : typeof message.message?.content
        });
        if (!message.message || !message.message.content) {
            return;
        }
        const content = message.message.content;
        // Content can be a string or an array of content blocks
        if (Array.isArray(content)) {
            this.logger.debug('Processing content blocks', {
                sessionId: message.session_id,
                blockCount: content.length,
                blockTypes: content.map(b => b.type)
            });
            content.forEach(block => {
                if (block.type === 'tool_use') {
                    this.processToolUse(message.session_id, block);
                }
            });
        }
    }
    /**
     * Process a tool use block to calculate line diffs
     */
    processToolUse(sessionId, toolUse) {
        const toolName = toolUse.name;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const input = toolUse.input;
        this.logger.debug('Processing tool use', {
            sessionId,
            toolName,
            toolId: toolUse.id,
            inputKeys: Object.keys(input || {})
        });
        // Get or create metrics for this session
        const metrics = this.metrics.get(sessionId) || {
            linesAdded: 0,
            linesRemoved: 0,
            editCount: 0,
            writeCount: 0
        };
        // Handle Edit and MultiEdit tools
        if (toolName === 'Edit' || toolName === 'MultiEdit') {
            if (toolName === 'Edit') {
                metrics.editCount++;
                this.calculateEditLineDiff(input, metrics);
            }
            else {
                // MultiEdit has an array of edits
                const edits = input.edits;
                if (Array.isArray(edits)) {
                    metrics.editCount += edits.length;
                    edits.forEach(edit => this.calculateEditLineDiff(edit, metrics));
                }
            }
        }
        // Handle Write tool
        else if (toolName === 'Write') {
            metrics.writeCount++;
            const content = input.content;
            if (typeof content === 'string') {
                const lines = this.countLines(content);
                metrics.linesAdded += lines;
                this.logger.debug('Write tool processed', {
                    sessionId,
                    linesAdded: lines,
                    contentLength: content.length
                });
            }
        }
        // Update metrics
        this.metrics.set(sessionId, metrics);
        this.logger.debug('Updated metrics', {
            sessionId,
            metrics
        });
    }
    /**
     * Calculate line diff for an edit operation using proper diff algorithm
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateEditLineDiff(input, metrics) {
        const oldString = input.old_string;
        const newString = input.new_string;
        // Handle edge cases
        if (typeof oldString !== 'string' || typeof newString !== 'string') {
            return;
        }
        // Use jsdiff to get accurate line-by-line changes
        const changes = diffLines(oldString, newString, {
            ignoreWhitespace: false,
            newlineIsToken: false
        });
        let linesAdded = 0;
        let linesRemoved = 0;
        changes.forEach(change => {
            if (change.added) {
                linesAdded += change.count || 0;
            }
            else if (change.removed) {
                linesRemoved += change.count || 0;
            }
        });
        metrics.linesAdded += linesAdded;
        metrics.linesRemoved += linesRemoved;
    }
    /**
     * Count lines in a string
     */
    countLines(text) {
        if (!text || text.length === 0) {
            return 0;
        }
        // Split by newline and filter out empty trailing line if it exists
        const lines = text.split('\n');
        // If the text ends with a newline, we don't count that as an extra line
        if (lines[lines.length - 1] === '') {
            return lines.length - 1;
        }
        return lines.length;
    }
    /**
     * Calculate metrics from historical conversation messages
     * This is used by ClaudeHistoryReader for past conversations
     */
    calculateMetricsFromMessages(messages) {
        const metrics = {
            linesAdded: 0,
            linesRemoved: 0,
            editCount: 0,
            writeCount: 0
        };
        messages.forEach(msg => {
            if (msg.type === 'assistant' && msg.message) {
                const message = msg.message;
                if (message.content && Array.isArray(message.content)) {
                    message.content.forEach(block => {
                        if (block.type === 'tool_use') {
                            this.processToolUseForMetrics(block, metrics);
                        }
                    });
                }
            }
        });
        return metrics;
    }
    /**
     * Process tool use for direct metrics calculation (used for historical data)
     */
    processToolUseForMetrics(toolUse, metrics) {
        const toolName = toolUse.name;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const input = toolUse.input;
        if (toolName === 'Edit' || toolName === 'MultiEdit') {
            if (toolName === 'Edit') {
                metrics.editCount++;
                this.calculateEditLineDiff(input, metrics);
            }
            else {
                const edits = input.edits;
                if (Array.isArray(edits)) {
                    metrics.editCount += edits.length;
                    edits.forEach(edit => this.calculateEditLineDiff(edit, metrics));
                }
            }
        }
        else if (toolName === 'Write') {
            metrics.writeCount++;
            const content = input.content;
            if (typeof content === 'string') {
                metrics.linesAdded += this.countLines(content);
            }
        }
    }
}
//# sourceMappingURL=ToolMetricsService.js.map