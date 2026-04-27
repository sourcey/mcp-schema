---
title: TypeScript Types
description: Use the exported TypeScript types from mcp-schema to model MCP server specifications in code.
---

## Typed package surface

The repository README calls out imports such as `McpSpec`, `McpTool`, and `McpResource` from the main package entrypoint.

```ts
import type { McpSpec, McpTool, McpResource } from "mcp-schema";
```

These types give downstream TypeScript projects a shared representation of an MCP server specification without requiring consumers to redefine the document shape themselves.

## Example

```ts
import type { McpSpec } from "mcp-schema";

const spec: McpSpec = {
  mcpSpec: "0.3.1",
  mcpVersion: "2025-11-25",
  server: {
    name: "weather-server",
    version: "1.0.0",
  },
  description: "Real-time weather data for any city.",
};
```

## What the types cover

Based on the repository documentation, the type surface covers:

- tools
- resources
- resource templates
- prompts
- server capabilities
- transports including stdio, SSE, and streamable HTTP
- schema-oriented structures such as `inputSchema`, `outputSchema`, and `$defs`

The changelog also notes newer type-level additions such as `McpIcon` and `icons` fields on multiple surfaces.

## When to prefer types

Use TypeScript types when you need to:

- construct MCP specs programmatically
- enforce the expected shape in application code
- share strongly typed spec data between modules
- catch structural mistakes before runtime validation

TypeScript types and JSON Schema are complementary. Types improve the authoring experience in code, while JSON Schema supports validator-based checks for serialized documents.

## Practical pattern

A common package-level pattern is to define a typed spec in TypeScript and then validate the serialized result using the schema export during tests or CI. That keeps authoring ergonomic while preserving a validator-backed contract for published or exchanged documents.
