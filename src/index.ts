/**
 * mcp-schema — TypeScript types and JSON Schema for MCP server specifications.
 *
 * Define, validate, and share static snapshots of Model Context Protocol servers.
 *
 * @example
 * ```ts
 * import type { McpSpec, McpTool } from "mcp-schema";
 *
 * const spec: McpSpec = {
 *   mcpSpec: "0.1.0",
 *   server: { name: "my-server", version: "1.0.0" },
 *   tools: [{
 *     name: "greet",
 *     description: "Say hello",
 *     inputSchema: {
 *       type: "object",
 *       properties: { name: { type: "string" } },
 *       required: ["name"],
 *     },
 *   }],
 * };
 * ```
 *
 * @packageDocumentation
 */

export type {
  // Root document
  McpSpec,

  // Icon
  McpIcon,

  // Tools
  McpTool,
  ToolAnnotations,

  // Resources
  McpResource,
  McpResourceTemplate,
  ResourceAnnotations,

  // Prompts
  McpPrompt,
  McpPromptArgument,

  // Server metadata
  McpServerInfo,
  McpCapabilities,
  McpTransport,

  // JSON Schema
  JsonSchema,
} from "./types.js";

export { mcpSpecSchema } from "./schema.js";

/** Current mcp.json format version. */
export const MCP_SPEC_VERSION = "0.3.1";
