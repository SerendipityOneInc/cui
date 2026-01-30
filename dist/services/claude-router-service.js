import { createLogger } from './logger.js';
import net from 'net';
/**
 * Wrapper around the Claude Code Router server
 */
export class ClaudeRouterService {
    server;
    config;
    logger;
    port = null;
    Server;
    constructor(config) {
        this.config = config;
        this.logger = createLogger('ClaudeRouterService');
    }
    async initialize() {
        if (!this.config.enabled) {
            this.logger.debug('Router service is disabled in configuration');
            return;
        }
        if (!this.config.providers || this.config.providers.length === 0) {
            this.logger.warn('Router enabled but no providers configured');
            return;
        }
        // Try to load the @musistudio/llms package dynamically
        try {
            const module = await import('@musistudio/llms');
            this.Server = module.default;
        }
        catch (_error) {
            this.logger.warn('@musistudio/llms package not installed. Router service disabled.');
            this.logger.debug('Install with: npm install @musistudio/llms');
            return;
        }
        this.logger.debug(`Router service initializing with ${this.config.providers.length} provider(s)`);
        try {
            // Pick an available localhost port dynamically
            this.port = await this.findOpenPort();
            this.logger.debug('Selected router port', { port: this.port });
            this.server = new this.Server({
                initialConfig: {
                    providers: this.config.providers,
                    Router: this.config.rules,
                    HOST: '127.0.0.1',
                    PORT: this.port
                }
            });
            // Add routing transformation hook BEFORE the server starts
            // This hook runs BEFORE the @musistudio/llms preHandler that splits by comma
            this.server.addHook('preHandler', async (req, _reply) => {
                // Only process /v1/messages requests (Claude API format)
                if (!req.url.startsWith('/v1/messages') || req.method !== 'POST') {
                    return;
                }
                try {
                    const body = req.body;
                    if (!body || !body.model) {
                        return;
                    }
                    // Apply routing transformation based on rules
                    let targetModel = body.model;
                    // Check if we have specific rules for this model
                    if (this.config.rules && typeof this.config.rules === 'object') {
                        // Check for exact model match
                        if (this.config.rules[body.model]) {
                            targetModel = this.config.rules[body.model];
                            this.logger.debug(`Routing ${body.model} -> ${targetModel}`);
                        }
                        // Check for haiku background routing
                        else if (body.model?.startsWith('claude-3-5-haiku') && this.config.rules.background) {
                            targetModel = this.config.rules.background;
                            this.logger.debug(`Routing haiku model ${body.model} -> ${targetModel}`);
                        }
                        // Check for thinking mode
                        else if (body.thinking && this.config.rules.think) {
                            targetModel = this.config.rules.think;
                            this.logger.debug(`Routing thinking mode -> ${targetModel}`);
                        }
                        // Check for web search
                        else if (Array.isArray(body.tools) &&
                            body.tools.some((tool) => tool.type?.startsWith('web_search')) &&
                            this.config.rules.webSearch) {
                            targetModel = this.config.rules.webSearch;
                            this.logger.debug(`Routing web search -> ${targetModel}`);
                        }
                        // Use default rule if available
                        else if (this.config.rules.default) {
                            targetModel = this.config.rules.default;
                            this.logger.debug(`Routing default ${body.model} -> ${targetModel}`);
                        }
                    }
                    // Update the model in the request body
                    // This will be in "provider,model" format for @musistudio/llms
                    body.model = targetModel;
                }
                catch (error) {
                    this.logger.error('Error in router preHandler hook:', error);
                    // Don't modify the request on error, let it pass through
                }
            });
            await this.server.start();
            this.logger.info('Claude Code Router started', { port: this.port });
        }
        catch (error) {
            this.logger.error('Failed to start Claude Code Router', error);
            this.server = undefined;
            throw error;
        }
    }
    isEnabled() {
        return !!this.server;
    }
    getProxyUrl() {
        const effectivePort = this.port ?? 14001;
        return `http://127.0.0.1:${effectivePort}`;
    }
    getProxyKey() {
        return 'router-managed';
    }
    async stop() {
        if (!this.server)
            return;
        this.logger.debug('Stopping Claude Code Router...');
        try {
            if (typeof this.server.app?.close === 'function') {
                await this.server.app.close();
            }
            else {
                this.logger.warn('Router server does not expose app.close(); skipping');
            }
        }
        catch (error) {
            this.logger.error('Error while stopping Claude Code Router', error);
        }
        finally {
            this.server = undefined;
            this.port = null;
            this.logger.debug('Claude Code Router stopped successfully');
        }
    }
    findOpenPort() {
        return new Promise((resolve, reject) => {
            const srv = net.createServer();
            srv.on('error', (err) => {
                reject(err);
            });
            srv.listen({ host: '127.0.0.1', port: 0 }, () => {
                const address = srv.address();
                if (address && typeof address === 'object') {
                    const selectedPort = address.port;
                    srv.close(() => resolve(selectedPort));
                }
                else {
                    srv.close(() => reject(new Error('Unable to determine open port')));
                }
            });
        });
    }
}
//# sourceMappingURL=claude-router-service.js.map