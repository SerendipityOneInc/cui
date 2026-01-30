import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to parse and convert query parameters to their proper types
 *
 * This middleware automatically converts:
 * - Numeric strings to numbers
 * - Boolean strings ('true', 'false') to booleans
 * - Preserves other types as-is
 */
export declare function queryParser(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=query-parser.d.ts.map