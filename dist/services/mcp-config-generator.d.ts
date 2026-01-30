import { FileSystemService } from '../services/file-system-service.js';
export interface MCPConfig {
    mcpServers: {
        [key: string]: {
            command: string;
            args: string[];
            env?: Record<string, string>;
        };
    };
}
/**
 * Generates and writes MCP configuration file
 */
export declare class MCPConfigGenerator {
    private configPath;
    private fileSystemService?;
    private logger;
    constructor(fileSystemService?: FileSystemService);
    /**
     * Generate MCP config with the permission server
     */
    generateConfig(port: number): Promise<string>;
    /**
     * Get the path to the generated config file
     */
    getConfigPath(): string;
    /**
     * Clean up the config file (for shutdown)
     */
    cleanup(): void;
}
//# sourceMappingURL=mcp-config-generator.d.ts.map