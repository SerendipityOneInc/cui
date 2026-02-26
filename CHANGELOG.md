# Changelog

All notable changes to CUI (Claude UI) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.8-srp] - 2026-02-26

### Added
- **Skill scanning for slash autocomplete**: Scan `~/.claude/skills/`, `plugins/marketplaces/`, and `plugins/cache/` directories to show all available skills in `/` autocomplete
- **Subdirectory command support**: Commands in `.claude/commands/subdir/file.md` now appear as `/subdir:file`
- **AskUserQuestion support in bypassPermissions mode**: Always add `--permission-prompt-tool` so interactive skill questions (AskUserQuestion) route through CUI dialog instead of failing silently
- **AskUserQuestion ToolLabel formatting**: Display question text instead of `[object Object]` in tool use labels
- **Flexible AskUserQuestion dialog**: Support both `{ questions: [...] }` array format and `{ question, options }` single question format

### Changed
- **Unified skill prompt format**: All skill recommendation prompts now use `/skill-name` format consistently (e.g. `/nano-banana Generate an image...`)
- **Removed non-functional builtin commands**: Removed `/clear`, `/compact`, `/init`, `/model`, `/permissions`, `/add-dir` from autocomplete — these are interactive-only commands that don't work in `-p` mode

### Removed
- **Create Diagram skill**: Removed from skill recommendations — `beautiful-mermaid` is a plugin, not a standalone skill

## [0.7.7-srp] - 2026-02-25

### Changed
- **Hide Task List on Home**: Conversation history is now managed by agent-platform D1, task tabs (Tasks/History/Archive) hidden from Home page
- **Inline Skill Browser**: Replaced modal-based skill library with inline expandable panel below skill chips, with scrollable content and search
- **Reorganized Skills**: Skills reorganized based on ECAP templates and SRP marketplace plugins
  - Featured chips: Generate Image, Lark Docs, SEO Optimize, Create Webpage
  - Extended panel: 14 skills across AllStaff, Developer, DevOps, Misc, Creative, Web/Marketing categories
  - All skill prompts now include placeholder hints for better UX

## [0.7.6-srp] - 2026-02-25

### Added
- **Conversation Sync to Agent Platform**: Push conversation metadata to agent-platform on session end
  - New `ConversationSyncService` pushes summaries to agent-platform D1 via `/api/conversations/sync`
  - Syncs on individual session end and bulk sync of all history on CUI startup
  - Configured via `CUI_SYNC_API_URL`, `CUI_SYNC_API_KEY`, and `CUI_WORKSPACE_PROJECT_NAME` env vars

## [0.7.5-srp] - 2026-02-24

### Changed
- **Simplified Home UI**: Hide workspace selector (defaults to `/workspace`), hide settings button
- **Run Button**: Replace permission mode dropdown with fixed "Run" button (`bypassPermissions`)

### Fixed
- **Permission Bypass**: Use `--dangerously-skip-permissions` CLI flag instead of `--permission-mode bypassPermissions` which did not actually skip permission checks
- **Resume Permissions**: Ensure resumed conversations also use `bypassPermissions` mode (Cmd+Enter and form submit were still using cached default mode)
- Skip `--permission-prompt-tool` in bypassPermissions mode to prevent permission requests from being forwarded to CUI UI

## [0.7.4-srp] - 2026-02-11

### Fixed
- Prevent relative path regex from corrupting absolute workspace path links

## [0.7.3-srp] - 2026-02-10

### Changed
- Updated "Generate Image" skill shortcut prompt to use Nano Banana explicitly

## [0.7.2-srp] - 2026-02-10

### Added
- **File Preview for Workspace Files**: Inline preview of output files in chat messages
  - Auto-detect `/workspace/` paths in assistant messages and convert to clickable R2 URLs
  - Support relative paths with known extensions (e.g. `nanobanana-output/image.png`) — auto-mapped under `/workspace/`
  - Images render inline with click-to-enlarge
  - Preview modal for HTML, Markdown, and PDF files (iframe/rendered view)
  - "Open in new tab" button for all previewable files
  - Workspace config via `~/.cui/config.json` or `CUI_WORKSPACE_BASE_URL` / `CUI_WORKSPACE_PROJECT_NAME` env vars
  - New API endpoint `GET /api/config/workspace`
  - Module-level caching for workspace config to avoid redundant API calls

### Fixed
- **Undefined Session Navigation**: Prevented `/c/undefined` URL when creating new conversations
  - Added defensive validation of `session_id` in ConversationView before navigation
  - Added session ID validation in TaskList click handler

### Changed
- Replaced bare "..." loading dots during chat initialization with "Starting conversation..." text with animated dots

## [0.7.0-srp] - 2026-02-09

### Added
- **Interactive AskUserQuestion UI**: Replaced raw JSON display with interactive option cards
  - Support for single-select (radio button style) and multi-select (checkbox style) questions
  - "Other" option with inline text input for custom responses
  - Compact, polished white dialog design with dark text for readability
  - Submit/Skip action buttons for better UX
  - Full `modifiedInput` flow support to pass user selections back to Claude CLI
- **Tool Pending State Indicators**: Added progress feedback for slow-loading tools
  - Animated "Running task...", "Loading skill...", etc. messages with dot pulse animation
  - Applies to Task, Skill, Bash, WebSearch, WebFetch, Read, Edit, Write, and search tools
  - Prevents user confusion when tools take time to execute

### Changed
- Enhanced PermissionDialog to detect and conditionally render AskUserQuestion UI
- Extended Composer callback signature to support `modifiedInput` parameter
- Updated ConversationView to thread `modifiedInput` through to API calls
- Improved ToolContent to show pending states instead of empty UI

### Technical Details
- AskUserQuestionDialog component with state management for selections and "Other" input
- Answers keyed by question header, comma-separated for multi-select
- Single-select automatically clears other options when user selects one
- Multi-select allows toggling multiple options simultaneously
- Backend already supported `modifiedInput` via PermissionDecisionRequest

## [0.6.9-srp] - 2026-02-09

### Added
- Skill shortcuts displayed below input box on Home page
- Interactive skill library modal with search and filtering
- Skill cards with visual indicators for user-invocable skills

### Changed
- Improved streaming indicator with "Thinking..." text animation
- Enhanced conversation status tracking and display

## Earlier Versions

See git history for changes prior to 0.6.9-srp.
