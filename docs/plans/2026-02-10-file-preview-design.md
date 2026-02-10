# File Preview in Chat Messages

## Problem

When CUI runs in an E2B sandbox, output files (images, HTML, markdown, PDFs) are saved to `/workspace/` which is mounted to an R2 bucket. Users need to preview these files directly in the chat UI without manually constructing URLs.

## Solution

Enhance the frontend Markdown renderer to detect file paths and links, map them to public R2 URLs, and render inline previews or clickable links.

## Architecture

```
CUI Config (server)          Frontend
─────────────────           ──────────────────────────────────
filePreview.baseUrl    →    GET /api/config/file-preview
filePreview.projectName →   Cached in component/context

Assistant message text       Markdown rendering pipeline
──────────────────────      ──────────────────────────────────
"/workspace/out/img.png" →  preprocessFileLinks() regex →
                            ReactMarkdown + custom components →
                            Inline <img> / clickable link /
                            preview button
```

## Path Mapping

```
Local:  /workspace/output/report.html
Public: {baseUrl}/{projectName}/workspace/output/report.html

Example:
  /workspace/output/report.html
  → https://pub-445e9780e6fc45f48a3a2a8953b60fae.r2.dev/proj_04322438/workspace/output/report.html
```

## File Type Handling

| Extension                  | Behavior                                    |
|---------------------------|---------------------------------------------|
| `.png/.jpg/.gif/.svg/.webp` | Inline image + click to enlarge             |
| `.html`                    | Clickable link + preview button → iframe modal |
| `.md`                      | Clickable link + preview button → rendered modal |
| `.pdf`                     | Clickable link + preview button → iframe modal |
| `https://` links           | Clickable, opens in new tab                 |
| Other files                | Clickable link, opens in new tab            |

## File Changes

### Backend (2 files)

1. **`src/services/config-service.ts`** — Add `filePreview` config section, support `CUI_WORKSPACE_BASE_URL` / `CUI_WORKSPACE_PROJECT_NAME` env vars
2. **`src/cui-server.ts`** — Add `GET /api/config/file-preview` endpoint

### Frontend (4 files)

3. **`src/web/chat/services/api.ts`** — Add `getFilePreviewConfig()` API call
4. **`src/web/chat/utils/file-preview.ts`** (new) — Utility functions:
   - `mapWorkspacePath(path, config)` — Map `/workspace/...` to full URL
   - `getFileType(path)` — Return type from extension
   - `preprocessFileLinks(text, config)` — Regex to convert bare paths to markdown links
5. **`src/web/chat/components/MessageList/MessageItem.tsx`** — Enhance `markdownComponents`:
   - Custom `a`: path mapping + image inline + preview button
   - Custom `img`: path mapping + click to enlarge
   - Pre-process text with `preprocessFileLinks()` before ReactMarkdown
6. **`src/web/chat/components/FilePreview/FilePreviewModal.tsx`** (new) — Preview modal:
   - iframe for HTML/PDF
   - react-markdown for MD
   - Image display with zoom

### Not Changed

- Backend message processing pipeline
- SSE stream protocol
- Existing ToolUseRenderer
