import { PushSubscription } from 'web-push';
export interface WebPushPayload {
    title: string;
    message: string;
    tag?: string;
    data?: Record<string, unknown>;
}
interface SubscriptionRow {
    endpoint: string;
    p256dh: string;
    auth: string;
    user_agent: string;
    created_at: string;
    last_seen: string;
    expired: number;
}
export declare class WebPushService {
    private static instance;
    private logger;
    private db;
    private dbPath;
    private configDir;
    private isInitialized;
    private configService;
    private insertStmt;
    private deleteStmt;
    private upsertSeenStmt;
    private listStmt;
    private countStmt;
    private constructor();
    static getInstance(): WebPushService;
    private initializePaths;
    initialize(): Promise<void>;
    private prepareStatements;
    private configureVapid;
    getPublicKey(): string | null;
    getEnabled(): boolean;
    getSubscriptionCount(): number;
    addOrUpdateSubscription(subscription: PushSubscription, userAgent?: string): void;
    removeSubscriptionByEndpoint(endpoint: string): void;
    listSubscriptions(): SubscriptionRow[];
    broadcast(payload: WebPushPayload): Promise<{
        sent: number;
        failed: number;
    }>;
}
export {};
//# sourceMappingURL=web-push-service.d.ts.map