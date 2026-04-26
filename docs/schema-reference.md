---
title: Schema Reference
description: Understand the mcp.json root document and the main schema sections covered by mcp-schema.
---

## What is `mcp.json`?

An MCP spec (`mcp.json`) is a static snapshot of an MCP server's capabilities: its tools, resources, and prompts. In the repository's own framing, it fills a role similar to `openapi.json` for MCP servers.

MCP servers describe themselves at runtime through listing endpoints such as `tools/list`, `resources/list`, and `prompts/list`. `mcp-schema` captures that information in a versionable, shareable document that can be used for documentation, validation, and code generation.

## Root document

The root document fields documented in the repository are:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `mcpSpec` | `string` | yes | Format version (semver) |
| `mcpVersion` | `string` | no | MCP protocol version such as `2025-11-25` |
| `server` | `object` | yes | Server name and version |
| `description` | `string` | no | Extended description in markdown |
| `capabilities` | `object` | no | Declared server capabilities |
| `transport` | `object` | no | Transport configuration hints |
| `tools` | `McpTool[]` | no | Tools the server exposes |
| `resources` | `McpResource[]` | no | Concrete resources |
| `resourceTemplates` | `McpResourceTemplate[]` | no | Parameterized resource templates |
| `prompts` | `McpPrompt[]` | no | Prompt templates |
| `$defs` | `object` | no | Shared schema definitions |

## Major sections

### Tools

Tools are used to describe callable server functionality. The README examples show support for input schema, output schema, and annotations.

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

Resources describe concrete content exposed by the server.

```json
{
  "uri": "docs://index",
  "name": "Documentation Index",
  "description": "Top-level index of all documentation pages",
  "mimeType": "application/json"
}
```

### Resource templates

Resource templates describe parameterized resource locations.

```json
{
  "uriTemplate": "docs://pages/{slug}",
  "name": "Documentation Page",
  "description": "A single documentation page by slug",
  "mimeType": "text/markdown"
}
```

### Prompts

Prompts define prompt templates and their arguments.

```json
{
  "name": "summarize_page",
  "description": "Summarize a documentation page",
  "arguments": [
    {
      "name": "url",
      "description": "Page URL to summarize",
      "required": true
    },
    {
      "name": "style",
      "description": "Summary style (brief, detailed)",
      "required": false
    }
  ]
}
```

## Validation workflow

The JSON Schema export is intended for validator-based checks of complete specs. A typical workflow is:

1. produce or collect an `mcp.json` document
2. compile `mcpSpecSchema` with a JSON Schema validator
3. validate the document during development, tests, or publishing
4. inspect validator errors when a document does not satisfy the schema

## Scope note

This documentation summarizes the package-level schema surface evidenced in the repository. For authoritative protocol semantics and the latest protocol documents, use the linked MCP specification resources from the project README.
