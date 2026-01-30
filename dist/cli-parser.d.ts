export interface CLIConfig {
    port?: number;
    host?: string;
    token?: string;
    skipAuthToken?: boolean;
}
/**
 * Parse command line arguments
 */
export declare function parseArgs(argv: string[]): CLIConfig;
//# sourceMappingURL=cli-parser.d.ts.map