import { Response } from 'express';
import { StreamEvent } from '../types/index.js';
import { EventEmitter } from 'events';
/**
 * Manages streaming connections to multiple clients
 */
export declare class StreamManager extends EventEmitter {
    private clients;
    private logger;
    private heartbeatInterval?;
    private readonly HEARTBEAT_INTERVAL_MS;
    constructor();
    /**
     * Add a client to receive stream updates
     */
    addClient(streamingId: string, res: Response): void;
    /**
     * Remove a client connection
     */
    removeClient(streamingId: string, res: Response): void;
    /**
     * Broadcast an event to all clients watching a session
     */
    broadcast(streamingId: string, event: StreamEvent): void;
    /**
     * Send an SSE event to a specific client
     */
    private sendSSEEvent;
    /**
     * Send SSE heartbeat (comment) to keep connection alive
     */
    private sendHeartbeat;
    /**
     * Get number of clients connected to a session
     */
    getClientCount(streamingId: string): number;
    /**
     * Get all active sessions
     */
    getActiveSessions(): string[];
    /**
     * Close all connections for a session
     */
    closeSession(streamingId: string): void;
    /**
     * Get total number of clients across all sessions
     */
    getTotalClientCount(): number;
    /**
     * Disconnect all clients from all sessions
     */
    disconnectAll(): void;
    /**
     * Start periodic heartbeat to keep SSE connections alive
     */
    private startHeartbeat;
    /**
     * Stop periodic heartbeat
     */
    private stopHeartbeat;
}
//# sourceMappingURL=stream-manager.d.ts.map