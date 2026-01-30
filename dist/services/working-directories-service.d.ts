import { WorkingDirectoriesResponse } from '../types/index.js';
import { ClaudeHistoryReader } from './claude-history-reader.js';
import { Logger } from './logger.js';
export declare class WorkingDirectoriesService {
    private historyReader;
    private logger;
    constructor(historyReader: ClaudeHistoryReader, logger: Logger);
    getWorkingDirectories(): Promise<WorkingDirectoriesResponse>;
    /**
     * Compute shortest unique suffixes for a list of paths
     *
     * Examples:
     * - ["/home/alice/project", "/home/bob/project"] -> ["alice/project", "bob/project"]
     * - ["/home/user/web", "/home/user/api"] -> ["web", "api"]
     * - ["/single/path"] -> ["path"]
     */
    private computeShortnames;
}
//# sourceMappingURL=working-directories-service.d.ts.map