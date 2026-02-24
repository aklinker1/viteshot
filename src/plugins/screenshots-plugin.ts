import type { PluginOption } from "vite";
import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import natsort from "natural-compare-lite";
import SCREENSHOT from "../assets/screenshot.html?raw" with { type: "text" };
import { toFilter } from "../utils";
import type { ResolvedConfig } from "../core/config";
import { getLocales } from "../core/get-locales";
import { getScreenshots } from "../core/get-screenshots";

const SCREENSHOTS_ID = "@viteshot/screenshots";
const SCREENSHOTS_FILTER = toFilter(SCREENSHOTS_ID);

const LOCALES_ID = "@viteshot/locales";
const LOCALES_FILTER = toFilter(LOCALES_ID);

export function screenshotsPlugin(config: ResolvedConfig): PluginOption {
  return [
    {
      name: "viteshot:screenshots",
      resolveId: {
        filter: { id: [SCREENSHOTS_FILTER] },
        handler: () => SCREENSHOTS_ID,
      },
      load: {
        filter: { id: [SCREENSHOTS_FILTER] },
        handler: async () => {
          const screenshots = await getScreenshots(config.screenshotsDir);
          return `export default ${JSON.stringify(screenshots)}`;
        },
      },
    },
    {
      name: "viteshot:locales",
      resolveId: {
        filter: { id: [LOCALES_FILTER] },
        handler: () => LOCALES_ID,
      },
      load: {
        filter: { id: [LOCALES_FILTER] },
        handler: async () => {
          const locales = await getLocales(config.localesDir);
          return `export default ${JSON.stringify(locales)}`;
        },
      },
    },
    {
      name: "viteshot:screenshot-loader",
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            if (!req.originalUrl?.startsWith("/screenshot")) return next();

            const url = new URL(req.originalUrl, "http://localhost");
            const screenshotId = url.pathname.slice(12);
            const language = url.searchParams.get("language") || undefined;
            const script = buildRenderScript(config, screenshotId, language);
            const html = SCREENSHOT.replaceAll("{{RENDER_SCRIPT}}", script);

            return res.end(
              await server.transformIndexHtml(req.originalUrl, html),
            );
          });
        };
      },
    },
  ];
}

function buildRenderScript(
  config: ResolvedConfig,
  id: string,
  language?: string,
): string {
  const ext = extname(id); // ".html", ".vue", ".tsx", etc

  if (ext === ".html") {
    return `
import HTML from '/@fs/${join(config.screenshotsDir, id)}?raw';
${language ? `import LOCALE from '/@fs/${join(config.localesDir, language)}.json';` : "const LOCALE = {}"}

console.log({ HTML, LOCALE })

app.innerHTML = Object.entries(LOCALE).reduce((text, [key, value]) => text.replaceAll(\`{{\${key}}}\`, value), HTML);`;
  }

  throw Error(
    `Unsupported extension (${ext}) when trying to render screenshot: ${id}`,
  );
}
