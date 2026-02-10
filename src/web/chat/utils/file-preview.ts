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
 * Map a /workspace/ path to a full R2 public URL
 * Returns null if config is not enabled or path doesn't match
 */
export function mapWorkspacePath(localPath: string, config: FilePreviewConfig): string | null {
  if (!config.enabled || !config.baseUrl || !config.projectName) return null;
  if (!localPath.startsWith('/workspace/')) return null;

  // /workspace/output/file.png → {baseUrl}/{projectName}/workspace/output/file.png
  return `${config.baseUrl}/${config.projectName}${localPath}`;
}

/**
 * Pre-process message text to convert bare /workspace/ paths into markdown links.
 *
 * Matches patterns like:
 *   /workspace/output/report.html
 *   `/workspace/output/report.html`
 *
 * Converts to: [report.html](/workspace/output/report.html)
 *
 * Skips paths already inside markdown link syntax [text](url) or ![alt](url).
 */
export function preprocessFileLinks(text: string, config: FilePreviewConfig): string {
  if (!config.enabled) return text;

  // Match /workspace/ paths that are NOT already inside markdown link parentheses
  // Negative lookbehind for ]( and ![ patterns
  return text.replace(
    /(?<!\]\()(?<!\()(`?)(\/(workspace\/[^\s`'")>\]]+))(`?)/g,
    (_match, backtickOpen: string, fullPath: string, _inner: string, backtickClose: string) => {
      const fileName = fullPath.split('/').pop() || fullPath;

      // If it was wrapped in backticks, replace the backticks with a link
      if (backtickOpen && backtickClose) {
        return `[${fileName}](${fullPath})`;
      }

      return `[${fileName}](${fullPath})`;
    }
  );
}

function getExtension(filePath: string): string {
  // Remove query string and hash
  const clean = filePath.split('?')[0].split('#')[0];
  const lastDot = clean.lastIndexOf('.');
  if (lastDot === -1) return '';
  return clean.substring(lastDot).toLowerCase();
}
