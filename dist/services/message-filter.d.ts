import { ConversationMessage } from '../types/index.js';
/**
 * Filters out local command messages from conversation history
 */
export declare class MessageFilter {
    private logger;
    private filteredPrefixes;
    constructor();
    /**
     * Filter an array of conversation messages
     */
    filterMessages(messages: ConversationMessage[]): ConversationMessage[];
    /**
     * Determine if a message should be kept (not filtered out)
     */
    private shouldKeepMessage;
    /**
     * Extract text content from Anthropic message object
     */
    private extractTextContent;
}
//# sourceMappingURL=message-filter.d.ts.map