import { FileSystemEntry } from '../types/index.js';
/**
 * Service for secure file system operations
 */
export declare class FileSystemService {
    private logger;
    private maxFileSize;
    private allowedBasePaths;
    constructor(maxFileSize?: number, allowedBasePaths?: string[]);
    /**
     * List directory contents with security checks
     */
    listDirectory(requestedPath: string, recursive?: boolean, respectGitignore?: boolean): Promise<{
        path: string;
        entries: FileSystemEntry[];
        total: number;
    }>;
    /**
     * Read file contents with security checks
     */
    readFile(requestedPath: string): Promise<{
        path: string;
        content: string;
        size: number;
        lastModified: string;
        encoding: string;
    }>;
    /**
     * Validate and normalize a path to prevent path traversal attacks
     */
    private validatePath;
    /**
     * Check if content appears to be valid UTF-8 text
     */
    private isValidUtf8;
    /**
     * List directory contents without recursion
     */
    private listDirectoryFlat;
    /**
     * List directory contents recursively
     */
    private listDirectoryRecursive;
    /**
     * Load gitignore patterns from a directory and its parents
     */
    private loadGitignore;
    /**
     * Check if a directory is a git repository
     */
    isGitRepository(dirPath: string): Promise<boolean>;
    /**
     * Get current git HEAD commit hash
     */
    getCurrentGitHead(dirPath: string): Promise<string | null>;
    /**
     * Validate that an executable exists and has executable permissions
     */
    validateExecutable(executablePath: string): Promise<void>;
}
//# sourceMappingURL=file-system-service.d.ts.map