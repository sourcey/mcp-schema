---
title: Getting Started
description: Install mcp-schema and use its types or JSON Schema in a first validation workflow.
---

## Install

```bash
npm install mcp-schema
```

## Choose the package surface you need

Most consumers start in one of two places:

1. Import TypeScript types from `mcp-schema`
2. Import the JSON Schema from `mcp-schema/schema`

Use the TypeScript entrypoint when you are creating or manipulating MCP server specifications in code. Use the schema entrypoint when you need validator-based checks, including build-time or test-time validation.

## First TypeScript example

```ts
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

## First validation example

```ts
import Ajv from "ajv";
import { mcpSpecSchema } from "mcp-schema/schema";

const ajv = new Ajv();
const validate = ajv.compile(mcpSpecSchema);

const valid = validate(spec);
if (!valid) {
  console.error(validate.errors);
}
```

This validator workflow is intentionally validator-agnostic at the package level. The repository README shows Ajv, but the exported schema can be used anywhere a compatible JSON Schema validator fits your workflow.

## What to read next

- Go to **Schema Reference** for the `mcp.json` document shape.
- Go to **TypeScript** for the exported type surface.
- Go to **Usage** for common package-level workflows.
