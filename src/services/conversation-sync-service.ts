import { createLogger, type Logger } from './logger.js';
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
export class ConversationSyncService {
  private apiUrl: string | undefined;
  private apiKey: string | undefined;
  private projName: string | undefined;
  private logger: Logger;

  constructor() {
    this.apiUrl = process.env.CUI_SYNC_API_URL;
    this.apiKey = process.env.CUI_SYNC_API_KEY;
    this.projName = process.env.CUI_WORKSPACE_PROJECT_NAME;
    this.logger = createLogger('ConversationSyncService');
  }

  get isEnabled(): boolean {
    return !!(this.apiUrl && this.apiKey && this.projName);
  }

  /**
   * Sync a single conversation session after it ends.
   */
  async syncSession(session: SyncSession): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const res = await fetch(`${this.apiUrl}/api/conversations/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          proj_name: this.projName,
          sessions: [session],
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        const body = await res.text();
        this.logger.warn('Conversation sync failed', { status: res.status, body });
      } else {
        this.logger.debug('Conversation synced', { sessionId: session.session_id });
      }
    } catch (error) {
      this.logger.warn('Conversation sync error', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Bulk sync all existing conversations (called on CUI startup).
   */
  async syncAll(historyReader: ClaudeHistoryReader): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const { conversations } = await historyReader.listConversations();
      if (conversations.length === 0) return;

      const sessions: SyncSession[] = conversations.map((c) => ({
        session_id: c.sessionId,
        summary: c.summary || '',
        model: c.model || '',
        message_count: c.messageCount || 0,
        total_duration_ms: c.totalDuration || 0,
        status: 'completed',
        created_at: c.createdAt || new Date().toISOString(),
        updated_at: c.updatedAt || new Date().toISOString(),
      }));

      // Batch in chunks of 50 to avoid huge payloads
      const BATCH_SIZE = 50;
      for (let i = 0; i < sessions.length; i += BATCH_SIZE) {
        const batch = sessions.slice(i, i + BATCH_SIZE);
        try {
          const res = await fetch(`${this.apiUrl}/api/conversations/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              proj_name: this.projName,
              sessions: batch,
            }),
            signal: AbortSignal.timeout(30000),
          });

          if (!res.ok) {
            const body = await res.text();
            this.logger.warn('Bulk sync batch failed', { status: res.status, body, batch: i });
          }
        } catch (error) {
          this.logger.warn('Bulk sync batch error', {
            error: error instanceof Error ? error.message : String(error),
            batch: i,
          });
        }
      }

      this.logger.info('Bulk conversation sync complete', { count: sessions.length });
    } catch (error) {
      this.logger.warn('Bulk sync failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
