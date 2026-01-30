import { Logger } from '../services/logger.js';
export interface ServerStartupOptions {
    host: string;
    port: number;
    authToken?: string;
    skipAuthToken?: boolean;
    logger: Logger;
}
/**
 * Display server startup information with rocket emoji and open browser
 */
export declare function displayServerStartup(options: ServerStartupOptions): void;
//# sourceMappingURL=server-startup.d.ts.map