# mcp-schema

[![CI](https://github.com/sourcey/mcp-schema/actions/workflows/ci.yml/badge.svg)](https://github.com/sourcey/mcp-schema/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/mcp-schema)](https://www.npmjs.com/package/mcp-schema)
[![license](https://img.shields.io/npm/l/mcp-schema)](https://github.com/sourcey/mcp-schema/blob/main/LICENSE)

TypeScript types and JSON Schema for [Model Context Protocol](https://modelcontextprotocol.io) server specifications.

Define, validate, and share static snapshots of MCP servers.

## MCP Protocol Compatibility

Built against the [MCP specification](https://github.com/modelcontextprotocol/specification). Supports protocol versions:

| Protocol Version | Status |
|------------------|--------|
| [`2025-11-25`](https://modelcontextprotocol.io/specification/2025-11-25) | Current stable |
| [`2025-06-18`](https://modelcontextprotocol.io/specification/2025-06-18) | Supported |
| [`2025-03-26`](https://modelcontextprotocol.io/specification/2025-03-26) | Supported |
| [`2024-11-05`](https://modelcontextprotocol.io/specification/2024-11-05) | Supported |

Types cover tools (with `inputSchema`, `outputSchema`, and [annotations](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#annotations)), resources, resource templates, prompts, server capabilities, and all three transports (stdio, SSE, streamable HTTP).

## Install

```bash
npm install mcp-schema
```

## Usage

### TypeScript types

```typescript
import type { McpSpec, McpTool, McpResource } from "mcp-schema";

const spec: McpSpec = {
  mcpSpec: "0.3.1",
  mcpVersion: "2025-11-25",
  server: { name: "weather-server", version: "1.0.0" },
  description: "Real-time weather data for any city.",
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a location",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name" },
        },
        required: ["city"],
      },
      outputSchema: {
        type: "object",
        properties: {
          temperature: { type: "number" },
          conditions: { type: "string" },
        },
      },
      annotations: { readOnlyHint: true },
    },
  ],
  resources: [
    {
      uri: "weather://cities",
      name: "Supported Cities",
      description: "List of cities with weather data",
      mimeType: "application/json",
    },
  ],
};
```

### JSON Schema validation

```typescript
import { mcpSpecSchema } from "mcp-schema/schema";

// Use with any JSON Schema validator
import Ajv from "ajv";

const ajv = new Ajv();
const validate = ajv.compile(mcpSpecSchema);

const valid = validate(spec);
if (!valid) {
  console.error(validate.errors);
}
```

## What is mcp.json?

An MCP spec (`mcp.json`) is a static snapshot of an MCP server's capabilities; its tools, resources, and prompts. Think of it as `openapi.json` for MCP servers.

MCP servers describe themselves at runtime via [`tools/list`](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#listing-tools), [`resources/list`](https://modelcontextprotocol.io/specification/2025-11-25/server/resources#listing-resources), and [`prompts/list`](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts#listing-prompts). An MCP spec captures that information in a versionable, shareable file that can be used for documentation, validation, and code generation.

## mcp.json Format

The root document:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mcpSpec` | `string` | yes | Format version (semver) |
| `mcpVersion` | `string` | no | MCP protocol version (e.g., `2025-11-25`) |
| `server` | `object` | yes | Server name and version |
| `description` | `string` | no | Extended description (markdown) |
| `capabilities` | `object` | no | Declared server capabilities |
| `transport` | `object` | no | Transport config hints |
| `tools` | `McpTool[]` | no | Tools the server exposes |
| `resources` | `McpResource[]` | no | Concrete resources |
| `resourceTemplates` | `McpResourceTemplate[]` | no | Parameterized resource templates |
| `prompts` | `McpPrompt[]` | no | Prompt templates |
| `$defs` | `object` | no | Shared schema definitions |

### Tools

```json
{
  "name": "search_docs",
  "description": "Search documentation by query",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "limit": { "type": "number", "default": 10 }
    },
    "required": ["query"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "results": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "url": { "type": "string" }
          }
        }
      }
    }
  },
  "annotations": {
    "readOnlyHint": true,
    "openWorldHint": true
  }
}
```

### Resources

```json
{
  "uri": "docs://index",
  "name": "Documentation Index",
  "description": "Top-level index of all documentation pages",
  "mimeType": "application/json"
}
```

### Resource Templates

```json
{
  "uriTemplate": "docs://pages/{slug}",
  "name": "Documentation Page",
  "description": "A single documentation page by slug",
  "mimeType": "text/markdown"
}
```

### Prompts

```json
{
  "name": "summarize_page",
  "description": "Summarize a documentation page",
  "arguments": [
    { "name": "url", "description": "Page URL to summarize", "required": true },
    { "name": "style", "description": "Summary style (brief, detailed)", "required": false }
  ]
}
```

## MCP Specification Resources

- [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25) (current stable)
- [Specification repo](https://github.com/modelcontextprotocol/specification) (includes JSON Schema for each protocol version)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) (`@modelcontextprotocol/sdk`)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk) (`mcp` on PyPI)

## Related

- [mcp-parser](https://github.com/sourcey/mcp-parser): parse, validate, snapshot, and generate from MCP specs
- [sourcey](https://github.com/sourcey/sourcey): generate documentation from MCP specs, OpenAPI, and markdown

## License

MIT
