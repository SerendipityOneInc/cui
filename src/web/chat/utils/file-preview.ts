/**
 * File preview utilities for mapping workspace paths to R2 URLs
 * and detecting file types for inline preview.
 */

export interface FilePreviewConfig {
  enabled: boolean;
  baseUrl: string | null;
  projectName: string | null;
}

export type PreviewableFileType = 'image' | 'html' | 'markdown' | 'pdf' | 'other';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico']);
const HTML_EXTENSIONS = new Set(['.html', '.htm']);
const MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown']);
const PDF_EXTENSIONS = new Set(['.pdf']);

/**
 * Get file type from path/URL for preview handling
 */
export function getFileType(filePath: string): PreviewableFileType {
  const ext = getExtension(filePath);
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (HTML_EXTENSIONS.has(ext)) return 'html';
  if (MARKDOWN_EXTENSIONS.has(ext)) return 'markdown';
  if (PDF_EXTENSIONS.has(ext)) return 'pdf';
  return 'other';
}

/**
 * Check if a file type supports inline preview (modal)
 */
export function isPreviewable(filePath: string): boolean {
  const type = getFileType(filePath);
  return type !== 'other';
}

/**
 * Map a workspace path to a full R2 public URL.
 * Supports both absolute (/workspace/...) and relative paths (dir/file.png).
 * Relative paths are treated as being under /workspace/.
 * Returns null if config is not enabled or path doesn't match.
 */
export function mapWorkspacePath(localPath: string, config: FilePreviewConfig): string | null {
  if (!config.enabled || !config.baseUrl || !config.projectName) return null;

  if (localPath.startsWith('/workspace/')) {
    // /workspace/output/file.png → {baseUrl}/{projectName}/workspace/output/file.png
    return `${config.baseUrl}/${config.projectName}${localPath}`;
  }

  // Relative path: dir/file.png → {baseUrl}/{projectName}/workspace/dir/file.png
  if (!localPath.startsWith('/') && !localPath.startsWith('http')) {
    return `${config.baseUrl}/${config.projectName}/workspace/${localPath}`;
  }

  return null;
}

/**
 * Pre-process message text to convert workspace file paths into markdown links.
 *
 * Matches patterns like:
 *   /workspace/output/report.html        (absolute workspace path)
 *   `/workspace/output/report.html`      (backtick-wrapped)
 *   nanobanana-output/image.png          (relative path with known extension)
 *   output/report.pdf                    (relative path with known extension)
 *
 * Converts to: [filename](/workspace/...) or [filename](relative/path)
 *
 * Skips paths already inside markdown link syntax [text](url) or ![alt](url).
 */
export function preprocessFileLinks(text: string, config: FilePreviewConfig): string {
  if (!config.enabled) return text;

  // IMPORTANT: Relative paths must be processed BEFORE absolute paths.
  // If absolute paths are processed first, the created markdown links like
  // [file.png](/workspace/nanobanana-output/file.png) get corrupted by the
  // relative path regex matching partial paths (e.g. "output/file.png" after
  // the hyphen in "nanobanana-output").

  // 1. Match relative paths with known previewable extensions
  // Pattern: word-chars/path/file.ext where ext is a known type
  // Negative lookbehind to avoid matching inside existing markdown links or URLs
  const previewableExts = 'png|jpg|jpeg|gif|svg|webp|bmp|ico|html|htm|md|markdown|pdf';
  const relativePathRegex = new RegExp(
    `(?<![\\[\\](!/])(?<![\\w/.\\-])` +                    // not inside link or preceded by path/hyphen chars
    `(\`?)` +                                               // optional opening backtick
    `([\\w][\\w./-]*\\.(?:${previewableExts}))` +          // relative path with known extension
    `(\`?)` +                                               // optional closing backtick
    `(?![\\w/])`,                                           // not followed by path chars
    'gi'
  );

  let result = text.replace(
    relativePathRegex,
    (_match, _backtickOpen: string, relativePath: string) => {
      const fileName = relativePath.split('/').pop() || relativePath;
      return `[${fileName}](${relativePath})`;
    }
  );

  // 2. Match absolute /workspace/ paths
  result = result.replace(
    /(?<!\]\()(?<!\()(`?)(\/(workspace\/[^\s`'")>\]]+))(`?)/g,
    (_match, _backtickOpen: string, fullPath: string) => {
      const fileName = fullPath.split('/').pop() || fullPath;
      return `[${fileName}](${fullPath})`;
    }
  );

  return result;
}

function getExtension(filePath: string): string {
  // Remove query string and hash
  const clean = filePath.split('?')[0].split('#')[0];
  const lastDot = clean.lastIndexOf('.');
  if (lastDot === -1) return '';
  return clean.substring(lastDot).toLowerCase();
}
