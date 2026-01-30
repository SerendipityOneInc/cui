import { Router } from 'express';
import { ClaudeProcessManager } from '../services/claude-process-manager.js';
import { ClaudeHistoryReader } from '../services/claude-history-reader.js';
export interface SystemRoutesOptions {
    skipAuthToken?: boolean;
}
export declare function createSystemRoutes(processManager: ClaudeProcessManager, historyReader: ClaudeHistoryReader, options?: SystemRoutesOptions): Router;
//# sourceMappingURL=system.routes.d.ts.map