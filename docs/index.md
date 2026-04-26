---
title: mcp-schema
description: TypeScript types and JSON Schema for MCP server specifications.
---

`mcp-schema` provides TypeScript types and JSON Schema for MCP server specifications.

The package is designed for projects that need to define, validate, and share static snapshots of MCP servers. It stays focused on the package surface evidenced in this repository: schema definitions, exported types, protocol-version compatibility, and the `mcp.json` document shape.

## What it provides

- TypeScript types for MCP server specifications
- JSON Schema for validator-based checks
- Coverage for tools, resources, resource templates, prompts, capabilities, and transports
- A versioned package surface for sharing static MCP server snapshots

## Protocol compatibility

Built against the MCP specification and documented support matrix in the repository README.

| Protocol Version | Status |
| --- | --- |
| `2025-11-25` | Current stable |
| `2025-06-18` | Supported |
| `2025-03-26` | Supported |
| `2024-11-05` | Supported |

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

## In this documentation

- **Getting Started** covers installation and the fastest path to first use.
- **Schema Reference** explains the `mcp.json` root document and its main sections.
- **TypeScript** focuses on the typed package surface for downstream consumers.
- **Usage** shows package-level workflows grounded in the repository examples.
- **Changelog** keeps release history visible in the docs surface.

## Related project entrypoints

The repository README remains the canonical front door for badges, quick package context, and upstream links. The changelog remains the release-history source.
