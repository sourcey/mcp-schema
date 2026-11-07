/** Official Agent Plugins configuration contract, separate from server snapshots. */
import { schema } from "./agent-plugins/schema.js";

export const agentPluginsMcpSchema = schema;
export const AGENT_PLUGINS_MCP_SCHEMA_URL = schema.$id;
export type { AgentPluginsMCPConfiguration as AgentPluginsMcpConfig } from "./agent-plugins/types.js";
import type { AgentPluginsMCPConfiguration as AgentPluginsMcpConfig } from "./agent-plugins/types.js";
export type AgentPluginsMcpServer = AgentPluginsMcpConfig["mcpServers"][string];
