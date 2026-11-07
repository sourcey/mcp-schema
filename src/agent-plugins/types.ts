/* Generated from the official Agent Plugins MCP schema. Run npm run generate:agent-plugins. */

export type MCPServer = StdioMCPServer | StreamableHTTPMCPServer | LegacyHTTPSSEMCPServer;

/**
 * Machine-readable schema for mcp.json in Agent Plugins 1.0.0. The Agent Plugins specification defines additional semantic and operational requirements.
 */
export interface AgentPluginsMCPConfiguration {
  /**
   * Canonical identifier of the MCP configuration schema for the Agent Plugins version targeted by this document.
   */
  $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
  mcpServers: {
    [k: string]: MCPServer;
  };
}
export interface StdioMCPServer {
  type: "stdio";
  /**
   * Executable token. Resolution rules are defined by the Agent Plugins specification.
   */
  command: string;
  args?: string[];
  env?: {
    [k: string]: string;
  };
  /**
   * Plugin-relative, PLUGIN_ROOT-rooted, or PLUGIN_DATA-rooted working directory. Filesystem containment is validated separately.
   */
  cwd?: string;
}
export interface StreamableHTTPMCPServer {
  type: "streamable-http";
  /**
   * MCP endpoint URL. URL semantics are defined by the Agent Plugins specification.
   */
  url: string;
  headers?: HTTPHeaders;
}
export interface HTTPHeaders {
  [k: string]: string;
}
export interface LegacyHTTPSSEMCPServer {
  type: "sse";
  /**
   * MCP endpoint URL. URL semantics are defined by the Agent Plugins specification.
   */
  url: string;
  headers?: HTTPHeaders;
}
