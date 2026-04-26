---
title: Changelog
description: Release history for mcp-schema.
---

# Changelog

All notable changes to `mcp-schema` are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org).

## [0.3.1] - 2026-04-21

### Changed
- Bump `typescript` to `^5.9.0` and `vitest` to `^3.2.0`.
- `MCP_SPEC_VERSION` advanced to `"0.3.1"` to match the package.

### Fixed
- Stale `mcp-spec` package-name references in doc comments and README examples carried over from the pre-rename package.

## [0.3.0] - 2026-04-06

### Added
- `McpIcon` type and `icons` field on tools, resources, resource templates, prompts, and server info.
- Optional `description` on `McpServerInfo` for human-readable server metadata.

## [0.2.0] - 2026-04-06

### Added
- Test suite (14 tests) and GitHub Actions CI matrix (Node 20, 22, 24).
- Badges and protocol-version compatibility table in the README.

### Changed
- Renamed from `mcp-spec` to `mcp-schema`.

## [0.1.0] - 2026-04-02

### Added
- Initial release: TypeScript types and JSON Schema for the `mcp.json` format — tools, resources, resource templates, prompts, server info, capabilities, and transports (stdio, SSE, streamable HTTP).
