import { describe, expect, it } from "vitest";
import { Ajv2020 } from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { agentPluginsMcpSchema, AGENT_PLUGINS_MCP_SCHEMA_URL } from "../src/index.js";
import type { AgentPluginsMcpConfig, AgentPluginsMcpServer } from "../src/index.js";

const validate = new Ajv2020().compile(agentPluginsMcpSchema);
const config = (server: unknown) => ({ $schema: AGENT_PLUGINS_MCP_SCHEMA_URL, mcpServers: { server } });

describe("official Agent Plugins MCP schema", () => {
  it("exports the upstream schema without modifying its contract", () => {
    const upstream = JSON.parse(readFileSync(new URL("../src/agent-plugins/mcp.schema.json", import.meta.url), "utf8"));
    expect(agentPluginsMcpSchema).toEqual(upstream);
    expect(AGENT_PLUGINS_MCP_SCHEMA_URL).toBe(upstream.$id);
  });

  it("accepts all three variants and an empty server map", () => {
    const document: AgentPluginsMcpConfig = {
      $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
      mcpServers: {
        local: { type: "stdio", command: "./bin/server", args: ["${PLUGIN_DATA}/db"], env: { CONFIG: "${PLUGIN_ROOT}/config.json" }, cwd: "${PLUGIN_ROOT}" },
        remote: { type: "streamable-http", url: "https://example.com/mcp", headers: { "X-Tenant": "public" } },
        legacy: { type: "sse", url: "https://example.com/sse" },
      },
    };
    expect(validate(document)).toBe(true);
    expect(validate({ ...document, mcpServers: {} })).toBe(true);
  });

  it.each([
    { type: "stdio", command: "node", url: "https://example.com" },
    { type: "stdio", command: "node", env: { PLUGIN_DATA: "override" } },
    { type: "stdio", command: "node", cwd: "/tmp" },
    { type: "stdio", command: "node", args: [1] },
    { type: "streamable-http", url: "https://example.com", command: "node" },
    { type: "sse", url: "https://example.com", headers: { X: 1 } },
    { type: "http", url: "https://example.com" },
  ])("rejects invalid or mixed variants: %j", (server) => {
    expect(validate(config(server))).toBe(false);
  });

  it("rejects missing or unknown schema identifiers and snapshot fields", () => {
    expect(validate({ mcpServers: {} })).toBe(false);
    expect(validate({ $schema: "urn:unsupported-test-schema", mcpServers: {} })).toBe(false);
    expect(validate({ $schema: AGENT_PLUGINS_MCP_SCHEMA_URL, mcpServers: {}, tools: [] })).toBe(false);
  });

  it("projects a discriminated server union from the schema", () => {
    const local: AgentPluginsMcpServer = { type: "stdio", command: "node" };
    // @ts-expect-error The remote variant cannot supply stdio fields.
    const mixed: AgentPluginsMcpServer = { type: "streamable-http", url: "https://example.com", command: "node" };
    expect(local.type).toBe("stdio");
    expect(mixed.type).toBe("streamable-http");
  });
});
