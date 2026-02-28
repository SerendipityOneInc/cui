export interface Command {
    name: string;
    type: 'builtin' | 'custom';
    description?: string;
}
/**
 * Get all available commands (custom commands + skills)
 */
export declare function getAvailableCommands(workingDirectory?: string): Command[];
//# sourceMappingURL=commands-service.d.ts.map