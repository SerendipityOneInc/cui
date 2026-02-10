import React, { useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import ReactMarkdown from 'react-markdown';
import type { PreviewableFileType } from '../../utils/file-preview';
import { getFileType } from '../../utils/file-preview';

interface FilePreviewModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  fileName: string;
}

export function FilePreviewModal({ open, onClose, url, fileName }: FilePreviewModalProps) {
  const fileType = getFileType(fileName);

  return (
    <Dialog open={open} onClose={onClose} title={`Preview: ${fileName}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileTypeIcon type={fileType} />
            <span className="text-sm font-medium truncate">{fileName}</span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Open in new tab
            <ExternalLinkIcon />
          </a>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-auto">
          <PreviewContent url={url} fileType={fileType} />
        </div>
      </div>
    </Dialog>
  );
}

function PreviewContent({ url, fileType }: { url: string; fileType: PreviewableFileType }) {
  switch (fileType) {
    case 'image':
      return (
        <div className="flex items-center justify-center p-4">
          <img
            src={url}
            alt="Preview"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
            loading="lazy"
          />
        </div>
      );

    case 'html':
      return (
        <iframe
          src={url}
          className="w-full h-[70vh] border-0 rounded-lg bg-white"
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      );

    case 'pdf':
      return (
        <iframe
          src={url}
          className="w-full h-[70vh] border-0 rounded-lg"
          title="PDF Preview"
        />
      );

    case 'markdown':
      return <MarkdownPreview url={url} />;

    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>Preview not available for this file type.</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm mt-2 inline-block"
          >
            Download file
          </a>
        </div>
      );
  }
}

function MarkdownPreview({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        return res.text();
      })
      .then(text => { if (!cancelled) setContent(text); })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [url]);

  if (error) {
    return <div className="text-red-500 text-sm p-4">Failed to load markdown: {error}</div>;
  }
  if (content === null) {
    return <div className="text-muted-foreground text-sm p-4">Loading...</div>;
  }
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert p-4">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

function FileTypeIcon({ type }: { type: PreviewableFileType }) {
  const iconClass = "w-4 h-4 text-muted-foreground";
  switch (type) {
    case 'image':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'html':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'pdf':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case 'markdown':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
  }
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
