# Changelog

All notable changes to this project will be documented in this file.

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
