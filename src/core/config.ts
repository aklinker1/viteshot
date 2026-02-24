import type {
  UserConfig as ViteUserConfig,
  InlineConfig as ViteInlineConfig,
} from "vite";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { assetsPlugin } from "../plugins/assets-plugin";
import { screenshotsPlugin } from "../plugins/screenshots-plugin";

export type UserConfig = ViteUserConfig & {
  localesDir?: string;
  screenshotsDir?: string;
  screenshotsOutputDir?: string;
  screenshotsConcurrency?: number;
};

export type InlineConfig = UserConfig & {
  root: string;
};

export type ResolvedConfig = {
  root: string;
  localesDir: string;
  screenshotsDir: string;
  screenshotsOutputDir: string;
  screenshotsConcurrency: number;
  vite: ViteInlineConfig;
};

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}

async function importConfig(root: string): Promise<UserConfig> {
  const configFile = join(root, "viteshot.config"); // Minus extension, not needed in import()
  const configFileUrl = pathToFileURL(configFile).href;

  try {
    const mod = await import(configFileUrl);
    return mod.default ?? {};
  } catch (err: any) {
    if (err?.message?.includes?.("Cannot find module")) return {};

    throw err;
  }
}

export async function resolveConfig(
  dir = process.cwd(),
): Promise<ResolvedConfig> {
  const root = resolve(dir);

  const {
    localesDir: _localesDir,
    screenshotsDir: _screenshotsDir,
    screenshotsOutputDir: _screenshotsOutputDir,
    screenshotsConcurrency: _screenshotsConcurrency,
    ...vite
  } = await importConfig(root);

  const screenshotsDir = _screenshotsDir
    ? resolve(root, _screenshotsDir)
    : join(root, "screenshots");
  const screenshotsOutputDir = _screenshotsOutputDir
    ? resolve(root, _screenshotsOutputDir)
    : join(root, "output");
  const localesDir = _localesDir
    ? resolve(root, _localesDir)
    : join(root, "locales");
  const screenshotsConcurrency = _screenshotsConcurrency || 1;

  const config: ResolvedConfig = {
    root,
    localesDir,
    screenshotsDir,
    screenshotsOutputDir,
    screenshotsConcurrency,
    vite: {
      ...vite,
      configFile: false,
    },
  };

  // Add plugins
  config.vite.plugins ??= [];
  config.vite.plugins.push(assetsPlugin(), screenshotsPlugin(config));

  return config;
}
