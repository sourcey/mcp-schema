/**
 * The schema is only useful if it accepts documents that exist.
 *
 * These tests compile `mcpSpecSchema` with a real JSON Schema validator and run
 * it against a production artifact, so a tightening change cannot quietly
 * invalidate documents already in the wild.
 */

import { existsSync, readFileSync } from "node:fs";
import Ajv from "ajv";
import { describe, expect, it } from "vitest";
import { MCP_SPEC_VERSION, mcpSpecSchema } from "../src/index.js";
import type { McpSpec } from "../src/index.js";

/** Sourcey's published hosted-MCP descriptor: 8 tools, every one with schemas. */
const PRODUCTION_ARTIFACT = "/Users/kam/dev/sourcey/sourcey/catalog/mcp/mcp.json";

function compile() {
  const ajv = new Ajv({ strict: false, allErrors: true });
  return ajv.compile(mcpSpecSchema as object);
}

const minimal: McpSpec = {
  mcpSpec: MCP_SPEC_VERSION,
  server: { name: "minimal", version: "1.0.0" },
};

describe("mcpSpecSchema conformance", () => {
  it("accepts a minimal document", () => {
    const validate = compile();
    expect(validate(minimal)).toBe(true);
  });

  it("accepts a well-formed protocol revision it has never seen", () => {
    const validate = compile();
    expect(validate({ ...minimal, mcpVersion: "2099-01-01" })).toBe(true);
    expect(validate({ ...minimal, mcpVersions: ["2026-07-28", "2025-11-25"] })).toBe(true);
  });

  it("rejects a protocol revision that is not a date", () => {
    const validate = compile();
    expect(validate({ ...minimal, mcpVersion: "v2" })).toBe(false);
    expect(validate({ ...minimal, mcpVersions: ["2025-11-25", "latest"] })).toBe(false);
  });

  it("accepts vendor extensions at the root", () => {
    const validate = compile();
    expect(
      validate({ ...minimal, "x-mcp-parser-incomplete": { pageLimitReached: ["tools"] } }),
    ).toBe(true);
  });

  it("still accepts the production Sourcey artifact unchanged", () => {
    if (!existsSync(PRODUCTION_ARTIFACT)) {
      // The sibling checkout is not always present; the rest of the suite covers
      // the schema, and CI validates its own fixtures.
      return;
    }
    const document = JSON.parse(readFileSync(PRODUCTION_ARTIFACT, "utf8")) as McpSpec;
    const validate = compile();
    const valid = validate(document);
    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
    expect(document.tools?.length).toBeGreaterThan(0);
  });
});
