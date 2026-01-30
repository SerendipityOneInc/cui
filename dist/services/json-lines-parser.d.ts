import { Transform, TransformCallback } from 'stream';
/**
 * Parses newline-delimited JSON (JSONL) stream
 */
export declare class JsonLinesParser extends Transform {
    private buffer;
    constructor();
    _transform(chunk: Buffer | string, encoding: string, callback: TransformCallback): void;
    _flush(callback: TransformCallback): void;
    /**
     * Reset the parser state
     */
    reset(): void;
    /**
     * Get current buffer content (for debugging)
     */
    getBuffer(): string;
}
//# sourceMappingURL=json-lines-parser.d.ts.map