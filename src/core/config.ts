import type {
  UserConfig as ViteUserConfig,
  InlineConfig as ViteInlineConfig,
} from "vite";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { resolverPlugin } from "./resolver-plugin";
import type { ScreenshotOptions } from "puppeteer-core";
import type { LaunchOptions } from "puppeteer-core";
import type { CreatePageOptions } from "puppeteer-core";

export type PuppeteerOptions = {
  launchOptions?: LaunchOptions;
  newPageOptions?: CreatePageOptions;
  screenshotOptions?: Omit<ScreenshotOptions, "clip" | "path">;
};

export type UserConfig = ViteUserConfig & {
  screenshots?: {
    /** @default "locales" */
    localesDir?: string;

    /** @default "designs" */
    designsDir?: string;

    /** @default "screenshots" */
    exportsDir?: string;

    /**
     * How many screenshots can be exported concurrently.
     *
     * @default 4
     */
    renderConcurrency?: number;

    /** Override the options passed into puppeteer. */
    puppeteer?: PuppeteerOptions;

    /**
     * List of relative paths from your viteshot.config.ts file to CSS files to
     * add to your screenshot's HTML file as links.
     */
    css?: string[];
  };
};

export type InlineConfig = UserConfig & {
  root: string;
};

export type ResolvedConfig = {
  root: string;
  localesDir: string;
  designsDir: string;
  exportsDir: string;
  renderConcurrency: number;
  puppeteer: PuppeteerOptions | undefined;
  css: string[];
  vite: ViteInlineConfig;
};

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}

async function importConfig(root: string): Promise<UserConfig> {
  const configFile = join(root, "viteshot.config.ts"); // Minus extension, not needed in import()
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

  const { screenshots: _screenshots, ...vite } = await importConfig(root);

  const designsDir = _screenshots?.designsDir
    ? resolve(root, _screenshots.designsDir)
    : join(root, "designs");
  const exportsDir = _screenshots?.exportsDir
    ? resolve(root, _screenshots.exportsDir)
    : join(root, "exports");
  const localesDir = _screenshots?.localesDir
    ? resolve(root, _screenshots.localesDir)
    : join(root, "locales");
  const renderConcurrency = _screenshots?.renderConcurrency || 4;

  const config: ResolvedConfig = {
    root,
    localesDir,
    designsDir,
    exportsDir,
    renderConcurrency,
    puppeteer: _screenshots?.puppeteer,
    css: _screenshots?.css ?? [],
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
