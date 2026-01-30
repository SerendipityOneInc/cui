import { Express } from 'express';
/**
 * Main CUI server class
 */
export declare class CUIServer {
    private app;
    private server?;
    private processManager;
    private streamManager;
    private historyReader;
    private statusTracker;
    private permissionTracker;
    private mcpConfigGenerator;
    private fileSystemService;
    private configService;
    private sessionInfoService;
    private conversationStatusManager;
    private workingDirectoriesService;
    private toolMetricsService;
    private notificationService;
    private webPushService;
    private routerService?;
    private logger;
    private port;
    private host;
    private configOverrides?;
    constructor(configOverrides?: {
        port?: number;
        host?: string;
        token?: string;
        skipAuthToken?: boolean;
    });
    /**
     * Get the Express app instance
     */
    getApp(): Express;
    /**
     * Get the configured port
     */
    getPort(): number;
    /**
     * Get the configured host
     */
    getHost(): string;
    /**
     * Initialize services without starting the HTTP server
     */
    initialize(): Promise<void>;
    /**
     * Start the server
     */
    start(): Promise<void>;
    /**
     * Stop the server gracefully
     */
    stop(): Promise<void>;
    /**
     * Cleanup resources during failed startup
     */
    private cleanup;
    private setupMiddleware;
    private setupRoutes;
    private setupProcessManagerIntegration;
    private setupPermissionTrackerIntegration;
    private initializeOrReloadRouter;
}
//# sourceMappingURL=cui-server.d.ts.map