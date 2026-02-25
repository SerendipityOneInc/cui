import { ClaudeHistoryReader } from './claude-history-reader.js';
interface SyncSession {
    session_id: string;
    summary: string;
    model: string;
    message_count: number;
    total_duration_ms: number;
    status: string;
    created_at: string;
    updated_at: string;
}
/**
 * Pushes conversation metadata to agent-platform D1 via sync API.
 * Configured via env vars: CUI_SYNC_API_URL, CUI_SYNC_API_KEY, CUI_WORKSPACE_PROJECT_NAME.
 */
export declare class ConversationSyncService {
    private apiUrl;
    private apiKey;
    private projName;
    private logger;
    constructor();
    get isEnabled(): boolean;
    /**
     * Sync a single conversation session after it ends.
     */
    syncSession(session: SyncSession): Promise<void>;
    /**
     * Bulk sync all existing conversations (called on CUI startup).
     */
    syncAll(historyReader: ClaudeHistoryReader): Promise<void>;
}
export {};
//# sourceMappingURL=conversation-sync-service.d.ts.map