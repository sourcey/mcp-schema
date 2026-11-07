# mcp-schema

[![CI](https://github.com/sourcey/mcp-schema/actions/workflows/ci.yml/badge.svg)](https://github.com/sourcey/mcp-schema/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/mcp-schema)](https://www.npmjs.com/package/mcp-schema)
[![license](https://img.shields.io/npm/l/mcp-schema)](https://github.com/sourcey/mcp-schema/blob/main/LICENSE)

TypeScript types and JSON Schema for [Model Context Protocol](https://modelcontextprotocol.io) server specifications.

Define, validate, and share static snapshots of MCP servers.

## Agent Plugins configuration and server snapshots

This package describes two distinct documents:

| Contract | Exports | Purpose |
| --- | --- | --- |
| Server snapshot | `McpSpec`, `mcpSpecSchema` | A server's tools, resources, prompts, and connection hints |
| [Agent Plugins 1.0.0 MCP configuration](https://agent-plugins.org/specification#721-discovery-and-configuration) | `AgentPluginsMcpConfig`, `AgentPluginsMcpServer`, `agentPluginsMcpSchema` | A plugin's named server connections in root `mcp.json` |

Both have been called `mcp.json`. Use a filename such as `api.snapshot.json` for
snapshots when working with an Agent Plugin. The standard plugin configuration
requires `$schema` and `mcpServers`; it does not contain introspection results.

```ts
import { agentPluginsMcpSchema, AGENT_PLUGINS_MCP_SCHEMA_URL } from "mcp-schema/agent-plugins";
import type { AgentPluginsMcpConfig } from "mcp-schema/agent-plugins";
import { Ajv2020 } from "ajv/dist/2020.js";

const config: AgentPluginsMcpConfig = {
  $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  mcpServers: {
    api: { type: "streamable-http", url: "https://example.com/mcp" },
    local: { type: "stdio", command: "./bin/server", cwd: "${PLUGIN_ROOT}" },
  },
};
const validate = new Ajv2020().compile(agentPluginsMcpSchema);
console.log(validate(config), AGENT_PLUGINS_MCP_SCHEMA_URL);
```

These exports are also available from the main entrypoint. The official schema
is bundled locally, and its TypeScript types are generated from those exact
schema bytes. It is a closed union of `stdio`, `streamable-http`, and legacy
`sse`. The normative specification additionally defines URL/header semantics,
filesystem containment, variable expansion, and failure boundaries that a JSON
Schema alone cannot enforce. [mcp-parser](https://github.com/sourcey/mcp-parser)
implements those configuration checks and named-server snapshotting.

### Maintaining the upstream contract

The published [canonical schema](https://agent-plugins.org/schemas/1.0.0/mcp.schema.json)
is the authority in `src/agent-plugins/mcp.schema.json`. Its generated runtime
export and types must pass `npm run check:agent-plugins` in CI. Run
`npm run check:agent-plugins -- --upstream` to compare with the canonical online
schema and detect a newer release on the published specification page. After
adopting a published specification release, review its normative
semantic changes in mcp-parser, update the canonical bytes, regenerate with
`npm run generate:agent-plugins`, and test both packages together. A working
draft is not automatically a supported release. No schema is downloaded at
runtime. Agent Plugins schema material is Apache-2.0 licensed; its license and
attribution are distributed with the package.

## What the snapshot describes

An `mcp.json` document is a static description of an MCP server's surface, not a
wire protocol. This package is therefore revision-independent: it records which
protocol revision a snapshot came from without being tied to any one of them.

`mcpVersion` holds the revision the server answered with, and `mcpVersions` holds
the set it reports it supports. Both are validated as `YYYY-MM-DD` shapes rather
than against a list of known revisions, so a document produced against a
revision newer than this package still validates.

Types cover tools (with `inputSchema`, `outputSchema`, and
[annotations](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#annotations)),
resources, resource templates, prompts, icons, server capabilities, and all three
transports (stdio, Streamable HTTP, and the specification-deprecated HTTP+SSE).

Deliberately out of scope: JSON-RPC envelopes, content types, sessions, and the
client features the specification deprecated in
[`2026-07-28`](https://modelcontextprotocol.io/specification/2026-07-28)
(roots, sampling, logging). A snapshot describes what a server offers, not a
conversation with it.

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
| `mcpVersion` | `string` | no | Protocol revision the server answered with, `YYYY-MM-DD` |
| `mcpVersions` | `string[]` | no | Every protocol revision the server reports it supports |
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

- [MCP Specification](https://modelcontextprotocol.io/specification/2026-07-28) (current revision)
- [Specification repo](https://github.com/modelcontextprotocol/specification) (includes JSON Schema for each protocol version)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) (`@modelcontextprotocol/sdk`)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk) (`mcp` on PyPI)

## Related

- [mcp-parser](https://github.com/sourcey/mcp-parser): snapshot live MCP servers, parse and validate `mcp.json`, and generate markdown/docs outputs
- [sourcey](https://github.com/sourcey/sourcey): generate documentation from MCP specs, OpenAPI, and markdown

## License

MIT
