import { EventEmitter } from 'events';
import { createLogger } from './logger.js';
/**
 * Manages streaming connections to multiple clients
 */
export class StreamManager extends EventEmitter {
    clients = new Map();
    buffers = new Map();
    logger;
    heartbeatInterval;
    // Send heartbeat every 30 seconds to keep connections alive
    HEARTBEAT_INTERVAL_MS = 30000;
    MAX_BUFFER_SIZE = 1000;
    constructor() {
        super();
        this.logger = createLogger('StreamManager');
    }
    /**
     * Enable buffering for a streaming session.
     * Messages will be buffered until a client connects, then replayed.
     */
    enableBuffering(streamingId) {
        this.logger.debug('Enabling buffering for session', { streamingId });
        this.buffers.set(streamingId, []);
    }
    /**
     * Add a client to receive stream updates
     */
    addClient(streamingId, res) {
        this.logger.debug('Adding client to stream', { streamingId });
        // Configure response for Server-Sent Events
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('X-Accel-Buffering', 'no');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.flushHeaders?.();
        // Initialize client set if needed
        if (!this.clients.has(streamingId)) {
            this.clients.set(streamingId, new Set());
        }
        // Add this client to the session
        this.clients.get(streamingId).add(res);
        this.logger.debug('Client added successfully', {
            streamingId,
            totalClients: this.clients.get(streamingId).size
        });
        // Send initial connection confirmation
        const connectionMessage = {
            type: 'connected',
            streaming_id: streamingId,
            timestamp: new Date().toISOString()
        };
        this.logger.debug('Sending initial SSE connection confirmation', {
            streamingId,
            clientCount: this.clients.get(streamingId).size
        });
        this.sendSSEEvent(res, connectionMessage);
        // Replay buffered messages if any
        const bufferedEvents = this.buffers.get(streamingId);
        if (bufferedEvents && bufferedEvents.length > 0) {
            this.logger.debug('Replaying buffered events to new client', {
                streamingId,
                bufferedCount: bufferedEvents.length
            });
            for (const event of bufferedEvents) {
                try {
                    this.sendSSEEvent(res, event);
                }
                catch (error) {
                    this.logger.error('Failed to replay buffered event', error, { streamingId });
                    break;
                }
            }
            // Clear buffer after replay
            this.buffers.delete(streamingId);
        }
        // Start heartbeat if this is the first client
        this.startHeartbeat();
        // Clean up when client disconnects
        res.on('close', () => {
            this.removeClient(streamingId, res);
        });
        res.on('error', (error) => {
            this.logger.error('Stream error for session', error, { streamingId });
            this.removeClient(streamingId, res);
        });
    }
    /**
     * Remove a client connection
     */
    removeClient(streamingId, res) {
        const clients = this.clients.get(streamingId);
        if (clients) {
            clients.delete(res);
            if (clients.size === 0) {
                this.clients.delete(streamingId);
            }
        }
        this.emit('client-disconnected', { streamingId });
        // Stop heartbeat if no clients remain
        if (this.getTotalClientCount() === 0) {
            this.stopHeartbeat();
        }
    }
    /**
     * Broadcast an event to all clients watching a session
     */
    broadcast(streamingId, event) {
        this.logger.debug('Broadcasting event to clients', {
            streamingId,
            eventType: event?.type,
            eventSubtype: 'subtype' in event ? event.subtype : undefined
        });
        const clients = this.clients.get(streamingId);
        if (!clients || clients.size === 0) {
            // Buffer the event if buffering is enabled for this session
            const buffer = this.buffers.get(streamingId);
            if (buffer) {
                if (buffer.length < this.MAX_BUFFER_SIZE) {
                    buffer.push(event);
                    this.logger.debug('Buffered event (no clients connected)', {
                        streamingId,
                        eventType: event?.type,
                        bufferSize: buffer.length
                    });
                }
                else {
                    this.logger.warn('Buffer full, dropping event', { streamingId, bufferSize: buffer.length });
                }
            }
            else {
                this.logger.debug('No clients found for streaming session, dropping message', { streamingId });
            }
            return;
        }
        this.logger.debug('Found clients for broadcast', {
            streamingId,
            clientCount: clients.size
        });
        const deadClients = [];
        for (const client of clients) {
            try {
                this.sendSSEEvent(client, event);
                this.logger.debug('Successfully sent SSE event to client', {
                    streamingId,
                    eventType: event?.type,
                    eventSubtype: 'subtype' in event ? event.subtype : undefined
                });
            }
            catch (error) {
                this.logger.error('Failed to send SSE event to client', error, { streamingId });
                deadClients.push(client);
            }
        }
        // Clean up dead clients
        deadClients.forEach(client => this.removeClient(streamingId, client));
    }
    /**
     * Send an SSE event to a specific client
     */
    sendSSEEvent(res, message, eventType) {
        if (res.writableEnded || res.destroyed) {
            throw new Error('Response is no longer writable');
        }
        let sseData = '';
        if (eventType) {
            sseData += `event: ${eventType}\n`;
        }
        sseData += `data: ${JSON.stringify(message)}\n\n`;
        // Log SSE event data
        this.logger.debug('Sending SSE event', {
            eventType,
            messageType: message?.type,
            messageSubtype: 'subtype' in message ? message.subtype : undefined,
            streamingId: 'streamingId' in message ? message.streamingId : 'streaming_id' in message ? message.streaming_id : undefined,
            sseDataLength: sseData.length
        });
        res.write(sseData);
        res.flush?.();
    }
    /**
     * Send SSE heartbeat (comment) to keep connection alive
     */
    sendHeartbeat(res) {
        if (!res.writableEnded && !res.destroyed) {
            res.write(': heartbeat\n\n');
        }
    }
    /**
     * Get number of clients connected to a session
     */
    getClientCount(streamingId) {
        return this.clients.get(streamingId)?.size || 0;
    }
    /**
     * Get all active sessions
     */
    getActiveSessions() {
        return Array.from(this.clients.keys());
    }
    /**
     * Close all connections for a session
     */
    closeSession(streamingId) {
        const clients = this.clients.get(streamingId);
        if (!clients)
            return;
        const closeEvent = {
            type: 'closed',
            streamingId: streamingId,
            timestamp: new Date().toISOString()
        };
        // Create array to avoid modifying set while iterating
        const clientsArray = Array.from(clients);
        this.logger.debug('Closing SSE session, sending close events to all clients', {
            streamingId,
            clientCount: clientsArray.length
        });
        for (const client of clientsArray) {
            try {
                this.sendSSEEvent(client, closeEvent);
                this.logger.debug('Sent SSE close event to client', { streamingId });
                client.end();
            }
            catch (error) {
                this.logger.error('Error closing SSE client connection', error, { streamingId });
            }
        }
        // Remove the entire session and its buffer
        this.clients.delete(streamingId);
        this.buffers.delete(streamingId);
        // Stop heartbeat if no clients remain
        if (this.getTotalClientCount() === 0) {
            this.stopHeartbeat();
        }
    }
    /**
     * Get total number of clients across all sessions
     */
    getTotalClientCount() {
        let total = 0;
        for (const clients of this.clients.values()) {
            total += clients.size;
        }
        return total;
    }
    /**
     * Disconnect all clients from all sessions
     */
    disconnectAll() {
        for (const streamingId of this.clients.keys()) {
            this.closeSession(streamingId);
        }
        this.buffers.clear();
        this.stopHeartbeat();
    }
    /**
     * Start periodic heartbeat to keep SSE connections alive
     */
    startHeartbeat() {
        if (this.heartbeatInterval) {
            return; // Already running
        }
        this.heartbeatInterval = setInterval(() => {
            this.logger.debug('Sending heartbeat to all clients');
            for (const clients of this.clients.values()) {
                for (const client of clients) {
                    try {
                        this.sendHeartbeat(client);
                    }
                    catch (error) {
                        this.logger.debug('Failed to send heartbeat to client', { error });
                    }
                }
            }
        }, this.HEARTBEAT_INTERVAL_MS);
    }
    /**
     * Stop periodic heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
            this.logger.debug('Stopped heartbeat');
        }
    }
}
//# sourceMappingURL=stream-manager.js.map