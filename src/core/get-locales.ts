import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { flattenObject } from "../utils";

export type Locale = {
  language: string;
  messages: Record<string, string>;
};

export async function getLocales(localesDir: string): Promise<Locale[]> {
  const allFilenames = await readdir(localesDir, {});
  const jsonFilenames = allFilenames.filter((file) => file.endsWith(".json"));

  return await Promise.all(
    jsonFilenames.map<Promise<Locale>>(async (file) => {
      const ext = extname(file);
      const path = join(localesDir, file);
      const text = await readFile(path, "utf-8");
      const messages = JSON.parse(text);
      return {
        language: file.slice(0, -ext.length),
        messages: flattenObject(messages),
      };
    }),
  );
}
