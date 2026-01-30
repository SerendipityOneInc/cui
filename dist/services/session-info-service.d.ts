import type { SessionInfo } from '../types/index.js';
/**
 * SessionInfoService manages session information using SQLite backend
 * Stores session metadata including custom names in ~/.cui/session-info.db
 * Provides fast lookups and updates for session-specific data
 */
export declare class SessionInfoService {
    private static instance;
    private logger;
    private dbPath;
    private configDir;
    private isInitialized;
    private db;
    private getSessionStmt;
    private insertSessionStmt;
    private updateSessionStmt;
    private deleteSessionStmt;
    private getAllStmt;
    private countStmt;
    private archiveAllStmt;
    private setMetadataStmt;
    private getMetadataStmt;
    constructor(customConfigDir?: string);
    static getInstance(): SessionInfoService;
    static resetInstance(): void;
    private initializePaths;
    initialize(): Promise<void>;
    private prepareStatements;
    private ensureMetadata;
    private mapRow;
    getSessionInfo(sessionId: string): Promise<SessionInfo>;
    updateSessionInfo(sessionId: string, updates: Partial<SessionInfo>): Promise<SessionInfo>;
    updateCustomName(sessionId: string, customName: string): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
    getAllSessionInfo(): Promise<Record<string, SessionInfo>>;
    getStats(): Promise<{
        sessionCount: number;
        dbSize: number;
        lastUpdated: string;
    }>;
    reinitializePaths(customConfigDir?: string): void;
    getDbPath(): string;
    getConfigDir(): string;
    archiveAllSessions(): Promise<number>;
    syncMissingSessions(sessionIds: string[]): Promise<number>;
}
//# sourceMappingURL=session-info-service.d.ts.map