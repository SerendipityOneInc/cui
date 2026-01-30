import { createLogger } from './logger.js';
/**
 * Filters out local command messages from conversation history
 */
export class MessageFilter {
    logger;
    filteredPrefixes = [
        'Caveat: ',
        '<command-name>',
        '<local-command-stdout>'
    ];
    constructor() {
        this.logger = createLogger('MessageFilter');
    }
    /**
     * Filter an array of conversation messages
     */
    filterMessages(messages) {
        return messages.filter(message => this.shouldKeepMessage(message));
    }
    /**
     * Determine if a message should be kept (not filtered out)
     */
    shouldKeepMessage(message) {
        // Only filter user messages with text content
        if (message.type !== 'user') {
            return true;
        }
        const textContent = this.extractTextContent(message.message);
        if (!textContent) {
            return true; // Keep messages without text content
        }
        // Check if the text starts with any filtered prefix
        const shouldFilter = this.filteredPrefixes.some(prefix => textContent.trim().startsWith(prefix));
        return !shouldFilter;
    }
    /**
     * Extract text content from Anthropic message object
     */
    extractTextContent(message) {
        if (typeof message === 'string') {
            return message;
        }
        if (message.content) {
            if (typeof message.content === 'string') {
                return message.content;
            }
            if (Array.isArray(message.content)) {
                // Find first text content block
                const textBlock = message.content.find((block) => block.type === 'text');
                return textBlock && 'text' in textBlock ? textBlock.text : null;
            }
        }
        return null;
    }
}
//# sourceMappingURL=message-filter.js.map