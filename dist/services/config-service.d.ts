import { CUIConfig } from '../types/config.js';
/**
 * ConfigService manages CUI configuration
 * Loads from ~/.cui/config.json
 * Creates default config on first run
 */
export declare class ConfigService {
    private static instance;
    private config;
    private logger;
    private configPath;
    private configDir;
    private emitter;
    private watcher?;
    private debounceTimer?;
    private lastLoadedRaw?;
    private pollInterval?;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): ConfigService;
    /**
     * Initialize configuration
     * Creates config file if it doesn't exist
     * Throws error if initialization fails
     */
    initialize(): Promise<void>;
    /**
     * Get current configuration
     * Throws if not initialized
     */
    getConfig(): CUIConfig;
    /**
     * Create default configuration
     */
    private createDefaultConfig;
    /**
     * Load configuration from file
     */
    private loadConfig;
    /**
     * Update configuration
     */
    updateConfig(updates: Partial<CUIConfig>): Promise<void>;
    /**
     * Subscribe to configuration changes
     */
    onChange(listener: (newConfig: CUIConfig, previous: CUIConfig | null, source: 'internal' | 'external') => void): void;
    /**
     * Validate provided fields in a partial config. Throws on incompatible values.
     */
    private validateProvidedFields;
    /**
     * Validate a complete merged config before using it. Throws on error.
     */
    private validateCompleteConfig;
    private assertServerConfig;
    private assertInterfaceConfig;
    private assertRouterConfig;
    private startWatching;
    private handleExternalChange;
    /**
     * Reset singleton instance (for testing)
     */
    static resetInstance(): void;
}
//# sourceMappingURL=config-service.d.ts.map