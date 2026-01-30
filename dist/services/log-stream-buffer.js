import { EventEmitter } from 'events';
export class LogStreamBuffer extends EventEmitter {
    buffer = [];
    maxBufferSize;
    constructor(maxBufferSize = 1000) {
        super();
        this.maxBufferSize = maxBufferSize;
    }
    addLog(logLine) {
        // Add to buffer
        this.buffer.push(logLine);
        // Maintain buffer size
        if (this.buffer.length > this.maxBufferSize) {
            this.buffer.shift();
        }
        // Emit for real-time streaming
        this.emit('log', logLine);
    }
    getRecentLogs(limit) {
        // Handle zero limit explicitly
        if (limit === 0) {
            return [];
        }
        // Handle undefined/null limit or limit larger than buffer
        if (limit === undefined || limit === null || limit >= this.buffer.length) {
            return [...this.buffer];
        }
        return this.buffer.slice(-limit);
    }
    clear() {
        this.buffer = [];
    }
}
// Singleton instance
export const logStreamBuffer = new LogStreamBuffer();
//# sourceMappingURL=log-stream-buffer.js.map