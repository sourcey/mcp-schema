import { defineConfig } from "sourcey";

export default defineConfig({
  theme: {
    preset: "minimal",
    colors: {
      primary: "#218bff",
      light: "#f6f8fa",
      dark: "#0d1117",
    },
    fonts: {
      sans: "inherit, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif",
      mono: "ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
    },
  },
  logo: "https://github.com/sourcey/mcp-schema/actions/workflows/ci.yml/badge.svg",
  favicon: "https://github.com/fluidicon.png",
  repo: "https://github.com/sourcey/mcp-schema",
  editBranch: "main",
  editBasePath: "docs",
  navigation: {
    tabs: [
      {
        tab: "Documentation",
        slug: "",
        groups: [
          {
            group: "Overview",
            pages: ["index", "readme", "getting-started"],
          },
          {
            group: "Reference",
            pages: ["schema-reference", "typescript", "usage", "changelog"],
          },
        ],
      },
    ],
  },
  navbar: {
    links: [{ type: "github", href: "https://github.com/sourcey/mcp-schema" }],
  },
  footer: {
    links: [{ type: "github", href: "https://github.com/sourcey/mcp-schema" }],
  },
  search: {
    featured: ["index", "readme", "schema-reference", "typescript", "usage"],
  },
});
