import { RouterConfiguration } from '../types/router-config.js';
/**
 * Wrapper around the Claude Code Router server
 */
export declare class ClaudeRouterService {
    private server?;
    private readonly config;
    private readonly logger;
    private port;
    private Server?;
    constructor(config: RouterConfiguration);
    initialize(): Promise<void>;
    isEnabled(): boolean;
    getProxyUrl(): string;
    getProxyKey(): string;
    stop(): Promise<void>;
    private findOpenPort;
}
//# sourceMappingURL=claude-router-service.d.ts.map