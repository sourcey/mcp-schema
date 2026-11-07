import { copyFile } from "node:fs/promises";

for (const name of ["LICENSE", "NOTICE", "mcp.schema.json"]) {
  await copyFile(`src/agent-plugins/${name}`, `dist/agent-plugins/${name}`);
}
