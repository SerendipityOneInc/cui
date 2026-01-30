import { ConversationMessage } from '../types/index.js';
import Anthropic from '@anthropic-ai/sdk';
export interface ConversationChain {
    sessionId: string;
    messages: ConversationMessage[];
    projectPath: string;
    summary: string;
    createdAt: string;
    updatedAt: string;
    totalDuration: number;
    model: string;
}
interface RawJsonEntry {
    type: string;
    uuid?: string;
    sessionId?: string;
    parentUuid?: string;
    timestamp?: string;
    message?: Anthropic.Message | Anthropic.MessageParam;
    cwd?: string;
    durationMs?: number;
    isSidechain?: boolean;
    userType?: string;
    version?: string;
    summary?: string;
    leafUuid?: string;
}
/**
 * Service for managing conversation cache with file modification tracking
 */
export declare class ConversationCache {
    private cache;
    private logger;
    private parsingPromise;
    constructor();
    /**
     * Clear the conversation cache to force a refresh on next read
     */
    clear(): void;
    /**
     * Get cached file entries, combining cached and newly parsed entries
     */
    getCachedFileEntries(currentFileModTimes: Map<string, number>, parseFileFunction: (filePath: string) => Promise<RawJsonEntry[]>, getSourceProject: (filePath: string) => string): Promise<(RawJsonEntry & {
        sourceProject: string;
    })[]>;
    /**
     * Update a specific file's cache entry
     */
    updateFileCache(filePath: string, entries: RawJsonEntry[], mtime: number, sourceProject: string): void;
    /**
     * Clear cache entry for a specific file
     */
    clearFileCache(filePath: string): void;
    /**
     * Check if a specific file's cache entry is valid
     */
    isFileCacheValid(filePath: string, currentMtime: number): boolean;
    /**
     * Get or parse conversations with file-level caching and concurrency protection
     */
    getOrParseConversations(currentFileModTimes: Map<string, number>, parseFileFunction: (filePath: string) => Promise<RawJsonEntry[]>, getSourceProject: (filePath: string) => string, processAllEntries: (allEntries: (RawJsonEntry & {
        sourceProject: string;
    })[]) => ConversationChain[]): Promise<ConversationChain[]>;
    /**
     * Execute file-based parsing with proper logging
     */
    private executeFileBasedParsing;
    /**
     * Get cache statistics for monitoring
     */
    getStats(): {
        isLoaded: boolean;
        cachedFileCount: number;
        totalCachedEntries: number;
        lastCacheTime: number | null;
        cacheAge: number | null;
        isCurrentlyParsing: boolean;
        fileCacheDetails: {
            filePath: string;
            entryCount: number;
            mtime: string;
        }[];
    };
}
export {};
//# sourceMappingURL=conversation-cache.d.ts.map