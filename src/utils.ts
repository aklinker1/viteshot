import { resolve, dirname, join } from "node:path";

export async function getViteshotAssetsDir(): Promise<string> {
  if (process.env.DEV) return resolve("assets");

  const pkgJsonPath = await import.meta
    .resolve("@aklinker1/viteshot/package.json");
  return join(dirname(pkgJsonPath), "assets");
}
