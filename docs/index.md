---
title: mcp-schema
description: TypeScript types and JSON Schema for MCP server specifications.
---

`mcp-schema` provides TypeScript types and JSON Schema for MCP server specifications.

The package is designed for projects that need to define, validate, and share static snapshots of MCP servers. It stays focused on the package surface evidenced in this repository: schema definitions, exported types, protocol-version compatibility, and the `mcp.json` document shape.

## What it provides

The package also exports the official Agent Plugins 1.0.0 MCP configuration
schema and generated `AgentPluginsMcpConfig` / `AgentPluginsMcpServer` types via
`mcp-schema/agent-plugins` and the main entrypoint. That configuration uses
`$schema` and `mcpServers` to connect to servers; the `McpSpec` snapshot below
records their advertised surfaces. Use separate filenames when authoring a
plugin: root `mcp.json` for its configuration and `api.snapshot.json` for a
snapshot. See the [README](https://github.com/sourcey/mcp-schema#agent-plugins-configuration-and-server-snapshots)
for validation, upstream maintenance, and the semantic checks implemented by
mcp-parser.

- TypeScript types for MCP server specifications
- JSON Schema for validator-based checks
- Coverage for tools, resources, resource templates, prompts, capabilities, and transports
- A versioned package surface for sharing static MCP server snapshots

## Protocol compatibility

An `mcp.json` document describes a server's static surface rather than the wire
protocol, so this package is revision-independent. `mcpVersion` records the
revision a server answered with and `mcpVersions` the set it supports; both are
validated as `YYYY-MM-DD` shapes, so documents produced against a revision newer
than this package still validate.

## Package boundaries

`mcp-schema` describes the static shape of an MCP server specification. It does not replace an MCP server runtime or SDK. Instead, it gives downstream consumers a shared contract for:

- authoring `mcp.json`
- validating specs with a JSON Schema validator
- importing typed structures in TypeScript
- documenting or generating from a stable snapshot of server capabilities

## Main entrypoints

| Entry point | Purpose |
| --- | --- |
| `mcp-schema` | TypeScript types such as `McpSpec`, `McpTool`, and `McpResource` |
| `mcp-schema/schema` | JSON Schema export for validation workflows |
| `mcp-schema/agent-plugins` | Official plugin MCP configuration schema and generated types |

## In this documentation

- **Getting Started** covers installation and the fastest path to first use.
- **Schema Reference** explains the `mcp.json` root document and its main sections.
- **TypeScript** focuses on the typed package surface for downstream consumers.
- **Usage** shows package-level workflows grounded in the repository examples.
- **Changelog** keeps release history visible in the docs surface.

## Related project entrypoints

The repository README remains the canonical front door for badges, quick package context, and upstream links. The changelog remains the release-history source.
