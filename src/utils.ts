import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function getViteshotAssetsDir(): Promise<string> {
  if (process.env.DEV) return resolve("assets");

  const pkgJsonPath = fileURLToPath(
    import.meta.resolve("@aklinker1/viteshot/package.json"),
  );
  const pkgDir = dirname(pkgJsonPath);
  return join(pkgDir, "assets");
}
