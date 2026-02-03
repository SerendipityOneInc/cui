# Changelog

All notable changes to this project will be documented in this file.

## 版本概览

| 版本 | 日期 | 主要变更 |
|------|------|----------|
| 0.6.7-srp | 2026-02-03 | 系统初始化超时可配置，支持插件冷启动场景 |
| 0.6.6-srp | 2026-02-03 | 升级 claude-code 到 2.x，支持 hook messages |
| 0.6.5-srp | 2026-02-02 | 容器环境默认 workspace 设为 /workspace |
| 0.6.4-srp | 2026-01-30 | dist 文件夹支持 GitHub 直接安装，CI 优化 |
| 0.6.3-srp.2 | 2026-01-30 | 修复 auth-config 端点认证问题 |
| 0.6.3-srp.1 | 2026-01-30 | skip-auth-token 前后端统一，token 存储改用 sessionStorage |
| 0.6.3-srp | 2026-01-30 | SRP 分支初始版本，基于上游 v0.6.3 |

## [0.6.7-srp] - 2026-02-03

### Changed

- **Configurable system init timeout**: System initialization timeout is now configurable via `CUI_SYSTEM_INIT_TIMEOUT_MS` environment variable (default: 120000ms). Previously hardcoded to 60 seconds, which was insufficient when Claude CLI cold-starts with many plugins/MCP servers installed.

## [0.6.6-srp] - 2026-02-03

### Changed

- **Upgrade @anthropic-ai/claude-code to 2.x**: Updated from `^1.0.70` to `^2.1.29` to use the latest Claude CLI features.

### Fixed

- **Support Claude CLI 2.x hook messages**: Fixed startup error when using Claude CLI 2.x which emits `hook_started`, `hook_completed`, and `hook_response` system messages before `init`. The process manager now skips these hook-related messages while waiting for the system init message.

### Added

- **SystemHookMessage type**: Added new type definition for hook-related system messages introduced in Claude CLI 2.x.

## [0.6.5-srp] - 2026-02-02

### Fixed

- **Set default workspace to /workspace when no conversations exist**: When running in container environments without existing conversations, the default workspace path is now set to `/workspace` instead of failing.

## [0.6.4-srp] - 2026-01-30

### Fixed

- **Fix auth middleware test missing path property**: Fixed test failure caused by missing `path` property in auth middleware test.

### Changed

- **Skip build for patch tags**: Release workflow now skips build step for patch tags (v*-srp.N) to speed up releases.
- **Update release workflow to create npm tarball**: Release workflow now creates npm tarball for easier installation.
- **Add dist folder for npm install from GitHub**: Include compiled dist folder in repo to support direct npm install from GitHub.
- **Make prepare script safe when husky is not available**: Prepare script now handles missing husky gracefully.

## [0.6.3-srp.2] - 2026-01-30

### Fixed

- **Fix /api/system/auth-config endpoint returning Unauthorized**: The auth-config endpoint was incorrectly requiring authentication. Added bypass paths in auth middleware to allow unauthenticated access to system endpoints (`/system/auth-config`, `/system/health`, `/system/hello`).

## [0.6.3-srp.1] - 2026-01-30

### Fixed

- **skip-auth-token now works for both frontend and backend**: Previously `--skip-auth-token` only disabled backend API authentication, frontend still showed login page. Now frontend checks `/api/system/auth-config` endpoint and skips login when auth is disabled.

### Changed

- **Token storage changed from cookie to sessionStorage**: Auth token is now stored in sessionStorage instead of cookie. This means:
  - Token persists across page refreshes within the same tab
  - Token is cleared when the browser tab is closed
  - More secure as sessionStorage is not sent with cross-origin requests

- **Support both URL fragment and query parameter for token**: Token can now be passed via either `#token=xxx` (fragment, preferred) or `?token=xxx` (query parameter). Fragment takes priority for security reasons.

### Added

- New endpoint `GET /api/system/auth-config` that returns `{ authRequired: boolean }` to indicate whether authentication is required.

## [0.6.3-srp] - 2026-01-30

### Added

- **SRP fork of CUI**: Initial SRP fork based on upstream v0.6.3.
- **CHANGELOG.md**: Added changelog to track SRP-specific changes.

### Fixed

- **fix(ExitPlan): match new ExitPlanMode key syntax**: Updated to match the new ExitPlanMode key syntax from upstream Claude CLI changes.

### Changed

- **CI improvements**: Extracted e2e checks to reusable workflow, added npm pack install-and-run check, refactored CI workflows to use a shared quality job.
