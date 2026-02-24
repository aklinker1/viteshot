import { defineConfig } from "tsdown";
import { resolve, dirname } from "node:path";
import { readFile } from "node:fs/promises";

const RAW_REGEX = /\?raw$/;

export default defineConfig({
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
