export interface Command {
    name: string;
    type: 'builtin' | 'custom';
    description?: string;
}
/**
 * Get hardcoded builtin commands
 */
export declare function getBuiltinCommands(): Command[];
/**
 * Get custom commands from .claude/commands/ directories
 */
export declare function getCustomCommands(workingDirectory?: string): Command[];
/**
 * Get all available commands (builtin + custom)
 */
export declare function getAvailableCommands(workingDirectory?: string): Command[];
//# sourceMappingURL=commands-service.d.ts.map