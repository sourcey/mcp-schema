import { readFile, writeFile } from "node:fs/promises";
import { compile } from "json-schema-to-typescript";

const source = new URL("../src/agent-plugins/mcp.schema.json", import.meta.url);
const target = new URL("../src/agent-plugins/types.ts", import.meta.url);
const schema = JSON.parse(await readFile(source, "utf8"));
const generated = await compile(schema, "AgentPluginsMcpConfig", {
  bannerComment: "/* Generated from the official Agent Plugins MCP schema. Run npm run generate:agent-plugins. */",
});
const runtime = new URL("../src/agent-plugins/schema.ts", import.meta.url);
const schemaModule = `/* Generated from mcp.schema.json. Run npm run generate:agent-plugins. */\nexport const schema = ${JSON.stringify(schema, null, 2)} as const;\n`;
for (const [file, content] of [[target, generated], [runtime, schemaModule]]) {
  if (process.argv.includes("--check")) {
    if (await readFile(file, "utf8") !== content) throw new Error("Agent Plugins projections have drifted; run npm run generate:agent-plugins");
  } else {
    await writeFile(file, content);
  }
}
if (process.argv.includes("--upstream")) {
  const response = await fetch(schema.$id);
  if (!response.ok || JSON.stringify(await response.json()) !== JSON.stringify(schema)) {
    throw new Error("Bundled Agent Plugins schema differs from its canonical upstream identifier");
  }
  const specification = await fetch("https://agent-plugins.org/specification");
  if (!specification.ok) throw new Error("Could not check the published Agent Plugins specification");
  const current = (await specification.text()).match(/Spec Version:\s*(\d+\.\d+\.\d+)/)?.[1];
  const supported = schema.$id.match(/\/schemas\/([^/]+)\//)?.[1];
  if (!current || current !== supported) throw new Error(`Published Agent Plugins release is ${current ?? "unrecognized"}; bundled support is ${supported}. Review the new release before adopting it.`);
}
