import { Logger as PinoLogger } from 'pino';
export interface LogContext {
    component?: string;
    sessionId?: string;
    streamingId?: string;
    requestId?: string;
    [key: string]: any;
}
/**
 * Wrapper class for Pino logger that provides an intuitive API
 * Translates logger.method('message', context) to Pino's logger.method(context, 'message')
 */
export type Logger = CUILogger;
export declare class CUILogger {
    private pinoLogger;
    constructor(pinoLogger: PinoLogger);
    debug(message: string, context?: any): void;
    info(message: string, context?: any): void;
    warn(message: string, context?: any): void;
    error(message: string, error?: Error | unknown, context?: any): void;
    fatal(message: string, error?: Error | unknown, context?: any): void;
    child(context: LogContext): CUILogger;
}
/**
 * Centralized logger service using Pino
 * Provides consistent logging across all CUI components
 * Log level is controlled by LOG_LEVEL environment variable
 */
declare class LoggerService {
    private static instance;
    private baseLogger;
    private logInterceptStream;
    private childLoggers;
    private constructor();
    /**
     * Get the singleton logger instance
     */
    static getInstance(): LoggerService;
    /**
     * Create a child logger with context
     */
    child(context: LogContext): CUILogger;
    /**
     * Get the base logger
     */
    getLogger(): CUILogger;
    /**
     * Log debug message
     */
    debug(message: string, context?: LogContext): void;
    /**
     * Log info message
     */
    info(message: string, context?: LogContext): void;
    /**
     * Log warning message
     */
    warn(message: string, context?: LogContext): void;
    /**
     * Log error message
     */
    error(message: string, error?: Error | unknown, context?: LogContext): void;
    /**
     * Log fatal message
     */
    fatal(message: string, error?: Error | unknown, context?: LogContext): void;
}
export declare const logger: LoggerService;
export declare function createLogger(component: string, baseContext?: LogContext): CUILogger;
export {};
//# sourceMappingURL=logger.d.ts.map