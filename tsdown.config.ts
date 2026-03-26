import { defineConfig } from "tsdown";
import { resolve, dirname } from "node:path";
import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { styleText } from "node:util";

const commitHash = execSync(`bun --silent build:hash`).toString().trim();
console.log(`${styleText("blue", "ℹ")} Commit hash: ${styleText("blue", commitHash)}`);

const RAW_REGEX = /\?raw$/;

export default defineConfig({
  define: {
    "process.env.DEV": "false",
    "process.env.COMMIT_HASH": JSON.stringify(commitHash),
  },
  plugins: [
    {
      name: "raw-text",
      resolveId: {
        filter: { id: RAW_REGEX },
        handler: (source, importer) => resolve(dirname(importer!), source),
      },
      load: {
        filter: { id: RAW_REGEX },
        handler: async (id) => {
          const path = id.slice(0, -4); // Remove "?raw"
          const text = await readFile(path, "utf8");
          return `export default ${JSON.stringify(text)}`;
        },
      },
    },
  ],
});
