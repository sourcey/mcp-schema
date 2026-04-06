import { describe, it, expect } from "vitest";
import type {
  McpSpec,
  McpIcon,
  McpTool,
  McpResource,
  McpResourceTemplate,
  McpPrompt,
  McpServerInfo,
  McpCapabilities,
  McpTransport,
  JsonSchema,
  ToolAnnotations,
  ResourceAnnotations,
  McpPromptArgument,
} from "../src/index.js";
import { MCP_SPEC_VERSION, mcpSpecSchema } from "../src/index.js";

describe("MCP_SPEC_VERSION", () => {
  it("exports a semver string", () => {
    expect(MCP_SPEC_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe("mcpSpecSchema", () => {
  it("is a valid JSON Schema object", () => {
    expect(mcpSpecSchema.type).toBe("object");
    expect(mcpSpecSchema.required).toContain("mcpSpec");
    expect(mcpSpecSchema.required).toContain("server");
  });

  it("defines tool schema with required fields", () => {
    const tools = mcpSpecSchema.properties!.tools as JsonSchema;
    const toolItems = tools.items as JsonSchema;
    expect(toolItems.required).toContain("name");
    expect(toolItems.required).toContain("inputSchema");
  });

  it("defines resource schema with required fields", () => {
    const resources = mcpSpecSchema.properties!.resources as JsonSchema;
    const resourceItems = resources.items as JsonSchema;
    expect(resourceItems.required).toContain("uri");
    expect(resourceItems.required).toContain("name");
  });

  it("defines prompt schema with required fields", () => {
    const prompts = mcpSpecSchema.properties!.prompts as JsonSchema;
    const promptItems = prompts.items as JsonSchema;
    expect(promptItems.required).toContain("name");
  });
});

describe("type definitions", () => {
  it("McpSpec compiles with minimal fields", () => {
    const spec: McpSpec = {
      mcpSpec: "0.1.0",
      server: { name: "test", version: "1.0.0" },
    };
    expect(spec.mcpSpec).toBe("0.1.0");
    expect(spec.server.name).toBe("test");
  });

  it("McpSpec compiles with all fields", () => {
    const spec: McpSpec = {
      mcpSpec: "0.1.0",
      mcpVersion: "2025-11-25",
      server: {
        name: "test",
        version: "1.0.0",
        description: "A test server implementation",
        websiteUrl: "https://example.com",
        icons: [{ src: "https://example.com/icon.png" }],
      },
      description: "A test server",
      capabilities: {
        tools: { listChanged: false },
        resources: { subscribe: true, listChanged: false },
        prompts: { listChanged: true },
        logging: {},
        completions: {},
      },
      transport: {
        type: "stdio",
        command: "node",
        args: ["server.js"],
        env: { DEBUG: "true" },
      },
      tools: [
        {
          name: "test_tool",
          description: "Does things",
          title: "Test Tool",
          inputSchema: {
            type: "object",
            properties: { arg: { type: "string" } },
            required: ["arg"],
          },
          outputSchema: { type: "object" },
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
            title: "Test",
          },
          icons: [
            { src: "https://example.com/tool.svg", mimeType: "image/svg+xml", theme: "dark" },
          ],
        },
      ],
      resources: [
        {
          uri: "test://resource",
          name: "Test Resource",
          description: "A resource",
          mimeType: "application/json",
          size: 1024,
          annotations: { audience: ["user", "assistant"], priority: 0.5 },
          icons: [{ src: "https://example.com/res.png", sizes: ["48x48", "96x96"] }],
        },
      ],
      resourceTemplates: [
        {
          uriTemplate: "test://{id}",
          name: "Test Template",
          description: "A template",
          mimeType: "text/plain",
          annotations: { audience: ["assistant"] },
          icons: [{ src: "data:image/png;base64,abc" }],
        },
      ],
      prompts: [
        {
          name: "test_prompt",
          description: "A prompt",
          arguments: [
            { name: "input", description: "The input", required: true },
            { name: "style", required: false },
          ],
          icons: [{ src: "https://example.com/prompt.png" }],
        },
      ],
      $defs: {
        SharedType: { type: "string", description: "Shared" },
      },
    };

    expect(spec.tools).toHaveLength(1);
    expect(spec.resources).toHaveLength(1);
    expect(spec.resourceTemplates).toHaveLength(1);
    expect(spec.prompts).toHaveLength(1);
  });

  it("McpTool requires name and inputSchema", () => {
    const tool: McpTool = {
      name: "minimal",
      inputSchema: { type: "object" },
    };
    expect(tool.name).toBe("minimal");
  });

  it("McpResource requires uri and name", () => {
    const resource: McpResource = {
      uri: "res://test",
      name: "Test",
    };
    expect(resource.uri).toBe("res://test");
  });

  it("McpResourceTemplate requires uriTemplate and name", () => {
    const template: McpResourceTemplate = {
      uriTemplate: "res://{id}",
      name: "Test",
    };
    expect(template.uriTemplate).toBe("res://{id}");
  });

  it("McpPrompt requires only name", () => {
    const prompt: McpPrompt = { name: "minimal" };
    expect(prompt.name).toBe("minimal");
  });

  it("McpIcon supports all fields", () => {
    const icon: McpIcon = {
      src: "https://example.com/icon.png",
      mimeType: "image/png",
      sizes: ["48x48", "96x96", "any"],
      theme: "light",
    };
    expect(icon.src).toBe("https://example.com/icon.png");
    expect(icon.theme).toBe("light");
  });

  it("McpServerInfo supports description, websiteUrl, and icons", () => {
    const info: McpServerInfo = {
      name: "test",
      version: "1.0.0",
      description: "A test server",
      websiteUrl: "https://example.com",
      icons: [{ src: "https://example.com/icon.png" }],
    };
    expect(info.description).toBe("A test server");
    expect(info.websiteUrl).toBe("https://example.com");
    expect(info.icons).toHaveLength(1);
  });

  it("supports vendor extensions via x- prefix", () => {
    const tool: McpTool = {
      name: "extended",
      inputSchema: { type: "object" },
      "x-custom": { group: "admin" },
    };
    expect(tool["x-custom"]).toEqual({ group: "admin" });
  });

  it("JsonSchema supports composition keywords", () => {
    const schema: JsonSchema = {
      oneOf: [
        { type: "string" },
        { type: "number" },
      ],
      $defs: {
        inner: { type: "boolean" },
      },
    };
    expect(schema.oneOf).toHaveLength(2);
  });

  it("McpTransport covers all transport types", () => {
    const stdio: McpTransport = { type: "stdio", command: "node", args: ["s.js"] };
    const sse: McpTransport = { type: "sse", url: "http://localhost:3000" };
    const http: McpTransport = { type: "streamable-http", url: "http://localhost:3000" };

    expect(stdio.type).toBe("stdio");
    expect(sse.type).toBe("sse");
    expect(http.type).toBe("streamable-http");
  });
});
