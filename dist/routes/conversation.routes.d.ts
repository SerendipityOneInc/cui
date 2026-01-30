import { Router } from 'express';
import { ClaudeProcessManager } from '../services/claude-process-manager.js';
import { ClaudeHistoryReader } from '../services/claude-history-reader.js';
import { SessionInfoService } from '../services/session-info-service.js';
import { ConversationStatusManager } from '../services/conversation-status-manager.js';
import { ToolMetricsService } from '../services/ToolMetricsService.js';
export declare function createConversationRoutes(processManager: ClaudeProcessManager, historyReader: ClaudeHistoryReader, statusTracker: ConversationStatusManager, sessionInfoService: SessionInfoService, conversationStatusManager: ConversationStatusManager, toolMetricsService: ToolMetricsService): Router;
//# sourceMappingURL=conversation.routes.d.ts.map