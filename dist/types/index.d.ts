import Anthropic from '@anthropic-ai/sdk';
export interface ToolMetrics {
    linesAdded: number;
    linesRemoved: number;
    editCount: number;
    writeCount: number;
}
export interface ConversationSummary {
    sessionId: string;
    projectPath: string;
    summary: string;
    sessionInfo: SessionInfo;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
    totalDuration: number;
    model: string;
    status: 'completed' | 'ongoing' | 'pending';
    streamingId?: string;
    toolMetrics?: ToolMetrics;
}
export interface ConversationMessage {
    uuid: string;
    type: 'user' | 'assistant' | 'system';
    message: Anthropic.Message | Anthropic.MessageParam;
    timestamp: string;
    sessionId: string;
    parentUuid?: string;
    isSidechain?: boolean;
    userType?: string;
    cwd?: string;
    version?: string;
    durationMs?: number;
}
export interface StreamMessage {
    type: 'system' | 'assistant' | 'user' | 'result';
    session_id: string;
}
export interface SystemInitMessage extends StreamMessage {
    type: 'system';
    subtype: 'init';
    cwd: string;
    tools: string[];
    mcp_servers: {
        name: string;
        status: string;
    }[];
    model: string;
    permissionMode: string;
    apiKeySource: string;
}
export interface AssistantStreamMessage extends StreamMessage {
    type: 'assistant';
    message: Anthropic.Message;
    parent_tool_use_id?: string;
}
export interface UserStreamMessage extends StreamMessage {
    type: 'user';
    message: Anthropic.MessageParam;
    parent_tool_use_id?: string;
}
export interface ResultStreamMessage extends StreamMessage {
    type: 'result';
    subtype: 'success' | 'error_max_turns';
    is_error: boolean;
    duration_ms: number;
    duration_api_ms: number;
    num_turns: number;
    result?: string;
    usage: {
        input_tokens: number;
        cache_creation_input_tokens: number;
        cache_read_input_tokens: number;
        output_tokens: number;
        server_tool_use: {
            web_search_requests: number;
        };
    };
}
export interface PermissionRequest {
    id: string;
    streamingId: string;
    toolName: string;
    toolInput: Record<string, unknown>;
    timestamp: string;
    status: 'pending' | 'approved' | 'denied';
    modifiedInput?: Record<string, unknown>;
    denyReason?: string;
}
export interface ConversationConfig {
    workingDirectory: string;
    initialPrompt: string;
    model?: string;
    allowedTools?: string[];
    disallowedTools?: string[];
    systemPrompt?: string;
    claudeExecutablePath?: string;
    previousMessages?: ConversationMessage[];
    permissionMode?: string;
}
export interface StartConversationRequest {
    workingDirectory: string;
    initialPrompt: string;
    model?: string;
    allowedTools?: string[];
    disallowedTools?: string[];
    systemPrompt?: string;
    permissionMode?: string;
    resumedSessionId?: string;
}
export interface StartConversationResponse {
    streamingId: string;
    streamUrl: string;
    sessionId: string;
    cwd: string;
    tools: string[];
    mcpServers: {
        name: string;
        status: string;
    }[];
    model: string;
    permissionMode: string;
    apiKeySource: string;
}
export interface ConversationListQuery {
    projectPath?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'created' | 'updated';
    order?: 'asc' | 'desc';
    hasContinuation?: boolean;
    archived?: boolean;
    pinned?: boolean;
}
export interface ConversationDetailsResponse {
    messages: ConversationMessage[];
    summary: string;
    projectPath: string;
    metadata: {
        totalDuration: number;
        model: string;
    };
    toolMetrics?: ToolMetrics;
}
export interface PermissionDecisionRequest {
    action: 'approve' | 'deny';
    modifiedInput?: Record<string, unknown>;
    denyReason?: string;
}
export interface PermissionDecisionResponse {
    success: boolean;
    message?: string;
}
export interface SystemStatusResponse {
    claudeVersion: string;
    claudePath: string;
    configPath: string;
    activeConversations: number;
    machineId: string;
}
export type StreamEvent = {
    type: 'connected';
    streaming_id: string;
    timestamp: string;
} | {
    type: 'permission_request';
    data: PermissionRequest;
    streamingId: string;
    timestamp: string;
} | {
    type: 'error';
    error: string;
    streamingId: string;
    timestamp: string;
} | {
    type: 'closed';
    streamingId: string;
    timestamp: string;
} | SystemInitMessage | AssistantStreamMessage | UserStreamMessage | ResultStreamMessage;
export declare class CUIError extends Error {
    code: string;
    statusCode: number;
    constructor(code: string, message: string, statusCode?: number);
}
export interface FileSystemEntry {
    name: string;
    type: 'file' | 'directory';
    size?: number;
    lastModified: string;
}
export interface FileSystemListQuery {
    path: string;
    recursive?: boolean;
    respectGitignore?: boolean;
}
export interface FileSystemListResponse {
    path: string;
    entries: FileSystemEntry[];
    total: number;
}
export interface FileSystemReadQuery {
    path: string;
}
export interface FileSystemReadResponse {
    path: string;
    content: string;
    size: number;
    lastModified: string;
    encoding: string;
}
export interface SessionInfo {
    custom_name: string;
    created_at: string;
    updated_at: string;
    version: number;
    pinned: boolean;
    archived: boolean;
    continuation_session_id: string;
    initial_commit_head: string;
    permission_mode: string;
}
export interface SessionRenameRequest {
    customName: string;
}
export interface SessionRenameResponse {
    success: boolean;
    sessionId: string;
    customName: string;
}
export interface SessionUpdateRequest {
    customName?: string;
    pinned?: boolean;
    archived?: boolean;
    continuationSessionId?: string;
    initialCommitHead?: string;
    permissionMode?: string;
}
export interface SessionUpdateResponse {
    success: boolean;
    sessionId: string;
    updatedFields: SessionInfo;
}
export interface Notification {
    title: string;
    message: string;
    priority: 'min' | 'low' | 'default' | 'high' | 'urgent';
    tags: string[];
    sessionId: string;
    streamingId: string;
    permissionRequestId?: string;
}
export interface WorkingDirectory {
    path: string;
    shortname: string;
    lastDate: string;
    conversationCount: number;
}
export interface WorkingDirectoriesResponse {
    directories: WorkingDirectory[];
    totalCount: number;
}
export interface Command {
    name: string;
    type: 'builtin' | 'custom';
    description?: string;
}
export interface CommandsResponse {
    commands: Command[];
}
export interface GeminiHealthResponse {
    status: 'healthy' | 'unhealthy';
    message: string;
    apiKeyValid: boolean;
}
export interface GeminiTranscribeRequest {
    audio: string;
    mimeType: string;
}
export interface GeminiTranscribeResponse {
    text: string;
}
export interface GeminiSummarizeRequest {
    text: string;
}
export interface GeminiSummarizeResponse {
    title: string;
    keypoints: string[];
}
export * from './config.js';
export * from './router-config.js';
//# sourceMappingURL=index.d.ts.map