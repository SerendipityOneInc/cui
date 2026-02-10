# File Preview in Chat Messages

## Problem

When CUI runs in an E2B sandbox, output files (images, HTML, markdown, PDFs) are saved to `/workspace/` which is mounted to an R2 bucket. Users need to preview these files directly in the chat UI without manually constructing URLs.

## Solution

Enhance the frontend Markdown renderer to detect file paths and links, map them to public R2 URLs, and render inline previews or clickable links.

## Architecture

```
CUI Config (server)          Frontend
─────────────────           ──────────────────────────────────
workspace.baseUrl       →    GET /api/config/workspace
workspace.projectName   →    Cached in component (module-level)

Assistant message text       Markdown rendering pipeline
──────────────────────      ──────────────────────────────────
"/workspace/out/img.png" →  preprocessFileLinks() regex →
"dir/image.png"          →  ReactMarkdown + custom components →
                            Inline <img> / clickable link /
                            preview button
```

## Path Mapping

### Absolute paths (`/workspace/...`)

```
Local:  /workspace/output/report.html
Public: {baseUrl}/{projectName}/workspace/output/report.html

Example:
  /workspace/output/report.html
  → https://pub-445e9780e6fc45f48a3a2a8953b60fae.r2.dev/proj_04322438/workspace/output/report.html
```

### Relative paths (with known extensions)

Relative paths with known previewable extensions (png, jpg, html, md, pdf, etc.) are automatically treated as files under `/workspace/`.

```
Local:  nanobanana-output/image.png
Public: {baseUrl}/{projectName}/workspace/nanobanana-output/image.png

Example:
  nanobanana-output/a_young_chinese_woman.png
  → https://pub-445e9780e6fc45f48a3a2a8953b60fae.r2.dev/proj_04322438/workspace/nanobanana-output/a_young_chinese_woman.png
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

## Configuration

### Config file (`~/.cui/config.json`)

```json
{
  "workspace": {
    "baseUrl": "https://pub-445e9780e6fc45f48a3a2a8953b60fae.r2.dev",
    "projectName": "proj_04322438"
  }
}
```

### Environment variables (for E2B sandbox)

```
CUI_WORKSPACE_BASE_URL=https://pub-445e9780e6fc45f48a3a2a8953b60fae.r2.dev
CUI_WORKSPACE_PROJECT_NAME=proj_04322438
```

Environment variables override config file values.

## File Changes

### Backend (3 files)

1. **`src/types/config.ts`** — Added `WorkspaceConfig` interface and `workspace?` field to `CUIConfig`
2. **`src/services/config-service.ts`** — `applyEnvOverrides()` reads `CUI_WORKSPACE_*` env vars after config load
3. **`src/routes/config.routes.ts`** — Added `GET /api/config/workspace` endpoint

### Frontend (4 files)

4. **`src/web/chat/services/api.ts`** — Added `getWorkspaceConfig()` API call
5. **`src/web/chat/utils/file-preview.ts`** (new) — Utility functions:
   - `mapWorkspacePath(path, config)` — Map `/workspace/...` or relative paths to full R2 URL
   - `getFileType(path)` — Return type from extension
   - `isPreviewable(path)` — Check if file supports inline preview
   - `preprocessFileLinks(text, config)` — Convert bare paths to markdown links (absolute + relative)
6. **`src/web/chat/components/MessageList/MessageItem.tsx`** — Enhanced `markdownComponents`:
   - Custom `a`: path mapping + image inline + preview button
   - Custom `img`: path mapping + click to enlarge
   - Pre-process text with `preprocessFileLinks()` before ReactMarkdown
   - Module-level config caching via `useFilePreviewConfig()` hook
7. **`src/web/chat/components/FilePreview/FilePreviewModal.tsx`** (new) — Preview modal:
   - iframe for HTML/PDF
   - react-markdown for MD
   - Image display with zoom

### Not Changed

- Backend message processing pipeline
- SSE stream protocol
- Existing ToolUseRenderer
