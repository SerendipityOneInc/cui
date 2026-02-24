/**
 * Configuration types for CUI
 */
import { RouterConfiguration } from './router-config.js';
export interface ServerConfig {
    host: string;
    port: number;
}
export interface GeminiConfig {
    /**
     * Google API key for Gemini
     * Can also be set via GOOGLE_API_KEY environment variable
     */
    apiKey?: string;
    /**
     * Gemini model to use
     * Default: 'gemini-2.5-flash'
     */
    model?: string;
}
export interface InterfaceConfig {
    colorScheme: 'light' | 'dark' | 'system';
    language: string;
    notifications?: {
        enabled: boolean;
        ntfyUrl?: string;
        webPush?: {
            subject?: string;
            vapidPublicKey?: string;
            vapidPrivateKey?: string;
        };
    };
}
export interface WorkspaceConfig {
    /**
     * Base URL for R2 public access
     * Example: "https://pub-445e9780e6fc45f48a3a2a8953b60fae.r2.dev"
     * Can also be set via CUI_WORKSPACE_BASE_URL environment variable
     */
    baseUrl: string;
    /**
     * Project name prefix in R2 bucket path
     * Example: "proj_04322438"
     * Can also be set via CUI_WORKSPACE_PROJECT_NAME environment variable
     */
    projectName: string;
}
export interface CUIConfig {
    /**
     * Unique machine identifier
     * Format: {hostname}-{16char_hash}
     * Example: "wenbomacbook-a1b2c3d4e5f6g7h8"
     */
    machine_id: string;
    /**
     * Server configuration
     */
    server: ServerConfig;
    /**
     * Authentication token for API access
     * 32-character random string generated on first run
     */
    authToken: string;
    /**
     * Gemini API configuration (optional)
     */
    gemini?: GeminiConfig;
    /**
     * Optional router configuration for Claude Code Router
     */
    router?: RouterConfiguration;
    /**
     * Interface preferences and settings
     */
    interface: InterfaceConfig;
    /**
     * Workspace configuration for R2-backed workspace files (optional)
     * When configured, /workspace/ paths in messages become clickable R2 URLs
     */
    workspace?: WorkspaceConfig;
}
/**
 * Default configuration values
 */
export declare const DEFAULT_CONFIG: Omit<CUIConfig, 'machine_id' | 'authToken'>;
//# sourceMappingURL=config.d.ts.map