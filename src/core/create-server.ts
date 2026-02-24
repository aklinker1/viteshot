import { createServer as createViteServer, type ViteDevServer } from "vite";
import { resolveConfig } from "./config";

export async function createServer(dir?: string): Promise<ViteDevServer> {
  const config = await resolveConfig(dir);

  return createViteServer(config.vite);
}
