import type {
  UserConfig as ViteUserConfig,
  InlineConfig as ViteInlineConfig,
} from "vite";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { resolverPlugin } from "./resolver-plugin";

export type UserConfig = ViteUserConfig & {
  localesDir?: string;
  designsDir?: string;
  screenshotsDir?: string;
  screenshotsConcurrency?: number;
};

export type InlineConfig = UserConfig & {
  root: string;
};

export type ResolvedConfig = {
  root: string;
  localesDir: string;
  designsDir: string;
  screenshotsDir: string;
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
    designsDir: _designsDir,
    screenshotsDir: _screenshotsDir,
    screenshotsConcurrency: _screenshotsConcurrency,
    ...vite
  } = await importConfig(root);

  const designsDir = _designsDir
    ? resolve(root, _designsDir)
    : join(root, "designs");
  const screenshotsDir = _screenshotsDir
    ? resolve(root, _screenshotsDir)
    : join(root, "screenshots");
  const localesDir = _localesDir
    ? resolve(root, _localesDir)
    : join(root, "locales");
  const screenshotsConcurrency = _screenshotsConcurrency || 1;

  const config: ResolvedConfig = {
    root,
    localesDir,
    designsDir,
    screenshotsDir,
    screenshotsConcurrency,
    vite: {
      ...vite,
      configFile: false,
    },
  };

  // Add plugins
  config.vite.plugins ??= [];
  config.vite.plugins.push(resolverPlugin(config));

  // Ignore virtual modules
  config.vite.resolve ??= {};
  config.vite.resolve.external ??= [];
  const external = config.vite.resolve.external;
  if (Array.isArray(external)) {
    external.push(
      "viteshot-assets/dashboard.ts",
      "viteshot-assets/screenshot.ts",
      "viteshot-virtual/render-screenshot?id={{screenshot.id}}",
      "viteshot-virtual/locale?id={{locale.id}}",
    );
  }

  return config;
}
