import { EventEmitter } from 'events';
export declare class LogStreamBuffer extends EventEmitter {
    private buffer;
    private maxBufferSize;
    constructor(maxBufferSize?: number);
    addLog(logLine: string): void;
    getRecentLogs(limit?: number): string[];
    clear(): void;
}
export declare const logStreamBuffer: LogStreamBuffer;
//# sourceMappingURL=log-stream-buffer.d.ts.map