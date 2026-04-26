---
title: Usage
description: Common package-level usage patterns for authoring and validating MCP server specifications.
---

## Typical workflows

`mcp-schema` is most useful when a project needs a stable, shareable description of an MCP server. The repository evidence supports a few clear package-level workflows.

### Author a static snapshot

Use the exported TypeScript types to define a server specification in code, including server metadata, tools, resources, prompts, capabilities, and transport hints.

This is useful when you want a versioned snapshot of a server surface rather than discovering it dynamically at runtime.

### Validate a spec during development or tests

Import `mcpSpecSchema` from `mcp-schema/schema` and compile it with a JSON Schema validator such as Ajv.

This helps catch mismatches in:

- required root fields
- tool and prompt shapes
- resource and resource template structure
- transport and capability declarations

### Share a spec across tooling

The repository README describes `mcp.json` as a versionable, shareable file that can support documentation, validation, and code generation. That makes the package a good fit when multiple tools or teams need the same MCP contract in a portable form.

## Example: typed authoring plus validation

```ts
import Ajv from "ajv";
import type { McpSpec } from "mcp-schema";
import { mcpSpecSchema } from "mcp-schema/schema";

const spec: McpSpec = {
  mcpSpec: "0.3.1",
  server: {
    name: "docs-server",
    version: "1.0.0",
  },
  tools: [
    {
      name: "search_docs",
      description: "Search documentation by query",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
        required: ["query"],
      },
    },
  ],
};

const ajv = new Ajv();
const validate = ajv.compile(mcpSpecSchema);

if (!validate(spec)) {
  console.error(validate.errors);
}
```

## Related resources

The repository points to these related resources:

- MCP Specification
- Specification repository
- TypeScript SDK
- Python SDK
- `mcp-parser` for parsing, validation, snapshotting, and generation from MCP specs
- `sourcey` for documentation generation from MCP specs, OpenAPI, and markdown

Use those upstream references when you need protocol semantics or adjacent tooling beyond the package scope documented here.
