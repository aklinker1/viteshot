import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";

export type Locale = {
  id: string;
  language: string;
  messages: Record<string, any>;
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
        id: file,
        language: file.slice(0, -ext.length),
        messages,
      };
    }),
  );
}
