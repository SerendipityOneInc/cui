# Changelog

All notable changes to CUI (Claude UI) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
