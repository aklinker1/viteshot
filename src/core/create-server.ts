import { createServer as createViteServer, type ViteDevServer } from "vite";
import { resolveConfig } from "./config";
import { logInvalidDesignFiles } from "./get-screenshots";

export async function createServer(dir?: string): Promise<ViteDevServer> {
  const config = await resolveConfig(dir);
  await logInvalidDesignFiles(config.designsDir);

  return createViteServer(config.vite);
}
