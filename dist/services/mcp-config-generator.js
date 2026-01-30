import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { createLogger } from '../services/logger.js';
// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Generates and writes MCP configuration file
 */
export class MCPConfigGenerator {
    configPath;
    fileSystemService;
    logger;
    constructor(fileSystemService) {
        this.logger = createLogger('MCPConfigGenerator');
        // Generate unique config file in temp directory
        const tempDir = tmpdir();
        const configFileName = `cui-mcp-config-${uuidv4()}.json`;
        this.configPath = join(tempDir, configFileName);
        this.fileSystemService = fileSystemService;
    }
    /**
     * Generate MCP config with the permission server
     */
    async generateConfig(port) {
        // Find MCP server relative to this module
        // In production: __dirname is /path/to/node_modules/cui-server/dist/services
        // In development: __dirname is /path/to/cui-server/src/services
        // MCP server is always in dist/mcp-server/index.js
        let mcpServerPath;
        if (__dirname.includes('/dist/') || __dirname.includes('\\dist\\')) {
            // Production: we're in dist/services, go up to dist then to mcp-server
            mcpServerPath = join(__dirname, '..', 'mcp-server', 'index.js');
        }
        else {
            // Development: we're in src/services, go up to root then to dist/mcp-server
            mcpServerPath = join(__dirname, '..', '..', 'dist', 'mcp-server', 'index.js');
        }
        // Validate that the MCP server file and Node.js executable exist
        if (this.fileSystemService) {
            // Check if MCP server JS file exists
            if (!existsSync(mcpServerPath)) {
                const error = new Error(`MCP server file not found: ${mcpServerPath}`);
                this.logger.warn('MCP server file not found, skipping MCP config generation', {
                    mcpServerPath,
                    error: error.message
                });
                throw error;
            }
            // Validate that the MCP server file is executable
            try {
                await this.fileSystemService.validateExecutable(mcpServerPath);
                this.logger.debug('MCP server file validated as executable successfully');
            }
            catch (error) {
                this.logger.warn('MCP server file is not executable, skipping MCP config generation', {
                    mcpServerPath,
                    error: error instanceof Error ? error.message : String(error)
                });
                throw error;
            }
            this.logger.debug('MCP server file and Node.js validated successfully', { mcpServerPath });
        }
        const config = {
            mcpServers: {
                'cui-permissions': {
                    command: 'node',
                    args: [mcpServerPath],
                    env: {
                        CUI_SERVER_URL: `http://localhost:${port}`,
                        CUI_SERVER_PORT: String(port),
                        LOG_LEVEL: process.env.LOG_LEVEL || 'info'
                    }
                }
            }
        };
        // Ensure directory exists
        mkdirSync(dirname(this.configPath), { recursive: true });
        // Write config file
        writeFileSync(this.configPath, JSON.stringify(config, null, 2));
        this.logger.info('MCP config file generated', {
            path: this.configPath,
            port,
            mcpServerPath
        });
        this.logger.debug('MCP config file', { config });
        return this.configPath;
    }
    /**
     * Get the path to the generated config file
     */
    getConfigPath() {
        return this.configPath;
    }
    /**
     * Clean up the config file (for shutdown)
     */
    cleanup() {
        try {
            unlinkSync(this.configPath);
            this.logger.debug('MCP config file cleaned up', { path: this.configPath });
        }
        catch (error) {
            this.logger.warn('Failed to clean up MCP config file', {
                path: this.configPath,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
}
//# sourceMappingURL=mcp-config-generator.js.map