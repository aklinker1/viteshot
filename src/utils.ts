import { resolve } from "node:path";

export async function getViteshotAssetsDir(): Promise<string> {
  if (process.env.DEV) return resolve("assets");
  else return import.meta.resolve("viteshot");
}
