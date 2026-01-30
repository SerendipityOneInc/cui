import { Request, Response, NextFunction } from 'express';
/**
 * Clear all rate limit entries (for testing)
 */
export declare function clearRateLimitStore(): void;
/**
 * Creates authentication middleware for API endpoints
 * @param tokenOverride - Optional token to use instead of config token
 * @returns Express middleware function
 */
export declare function createAuthMiddleware(tokenOverride?: string): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Authentication middleware for API endpoints
 * Validates Bearer token against config
 * Disabled in test environment unless ENABLE_AUTH_IN_TESTS is set
 */
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map