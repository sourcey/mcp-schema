# Changelog

All notable changes to `mcp-schema` are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org).

## [0.3.2] - 2026-07-30

### Added
- `mcpVersions` records every protocol revision a server reports it supports, since the protocol treats version breadth as a set.
- Conformance tests that compile the schema with a real validator and check it against a production `mcp.json`.

### Changed
- `mcpVersion` and `mcpVersions` are validated as `YYYY-MM-DD` shapes rather than against a list of known revisions, so a document produced against a newer protocol revision still validates.
- `MCP_SPEC_VERSION` advanced to `"0.3.2"` to match the package.
- README and docs describe what the format does instead of claiming protocol-version support the package does not implement.

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
