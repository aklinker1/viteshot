import type { Plugin, PluginOption } from "vite";
import type { ResolvedConfig } from "./config";
import {
  faviconSvgTemplate,
  dashboardHtmlTemplate,
  screenshotHtmlTemplate,
  renderHtmlScreenshotJsTemplate,
} from "../templates";
import { getViteshotAssetsDir } from "../utils";
import { extname, join } from "node:path";
import { getLocales } from "./get-locales";
import { getScreenshots } from "./get-screenshots";

function resolveTemplate(options: {
  match: (url: URL) => boolean;
  template: string;
  transform?: boolean;
  vars?: (url: URL) => Record<string, string>;
}): Plugin["configureServer"] {
  return (server) => () =>
    server.middlewares.use(async (req, res, next) => {
      if (!req.originalUrl) return;

      const url = new URL(req.originalUrl, "http://localhost");
      if (!options.match(url)) return next();

      const text =
        options.vars == null
          ? options.template
          : applyTemplateVars(options.template, options.vars(url));

      return res.end(
        options.transform
          ? await server.transformIndexHtml(req.originalUrl, text)
          : text,
      );
    });
}

const VIRTUAL_SCREENSHOTS_FILTER = {
  id: [/viteshot-virtual\/screenshots/],
};
const VIRTUAL_LOCALES_FILTER = { id: [/viteshot-virtual\/locales/] };

function applyTemplateVars(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (template, [key, value]) => template.replaceAll(`{{${key}}}`, value),
    template,
  );
}

const RENDER_SCREENSHOT_JS_TEMPLATES: Record<string, string> = {
  ".html": renderHtmlScreenshotJsTemplate,
};

export const resolverPlugin = (config: ResolvedConfig): PluginOption => [
  {
    name: "viteshot:resolve-favicon",
    configureServer: resolveTemplate({
      match: (url) => url.pathname === "/favicon.svg",
      template: faviconSvgTemplate,
    }),
  },
  {
    name: "viteshot:resolve-dashboard-html",
    configureServer: resolveTemplate({
      match: (url) => url.pathname === "/",
      template: dashboardHtmlTemplate,
      transform: true,
    }),
  },
  {
    name: "viteshot:resolve-screenshot-html",
    configureServer: resolveTemplate({
      match: (url) => url.pathname === "/screenshot",
      template: screenshotHtmlTemplate,
      transform: true,
      vars: (url) => ({
        "screenshot.id": encodeURIComponent(url.searchParams.get("sid") ?? ""),
        "locale.id": encodeURIComponent(url.searchParams.get("lid") ?? ""),
      }),
    }),
  },
  {
    name: "viteshot:resolve-assets",
    resolveId: {
      filter: { id: [/\/viteshot-assets\//] },
      handler: async (id) => {
        return join(await getViteshotAssetsDir(), id.slice(17));
      },
    },
  },
  {
    name: "viteshot:resolve-virtual:screenshots",
    resolveId: {
      filter: VIRTUAL_SCREENSHOTS_FILTER,
      handler: (id) => id,
    },
    load: {
      filter: VIRTUAL_SCREENSHOTS_FILTER,
      handler: async () => {
        const screenshots = await getScreenshots(config.screenshotsDir);
        return `export default ${JSON.stringify(screenshots)}`;
      },
    },
  },
  {
    name: "viteshot:resolve-virtual:locales",
    resolveId: {
      filter: VIRTUAL_LOCALES_FILTER,
      handler: (id) => id,
    },
    load: {
      filter: VIRTUAL_LOCALES_FILTER,
      handler: async () => {
        const locales = await getLocales(config.localesDir);
        return `export default ${JSON.stringify(locales)}`;
      },
    },
  },
  {
    name: "viteshot:resolve-virtual:render-screenshot",
    resolveId: {
      filter: { id: [/\/viteshot-virtual\/render-screenshot/] },
      handler: (id) => id,
    },
    load: {
      filter: { id: [/\/viteshot-virtual\/render-screenshot/] },
      handler: (id) => {
        const url = new URL(id, "http://localhost");
        const screenshotId = url.searchParams.get("id");
        if (!screenshotId)
          throw Error(`Required query param \"id\" not provided for ${id}`);

        const ext = extname(screenshotId);
        const path = join(config.screenshotsDir, screenshotId);
        const template = RENDER_SCREENSHOT_JS_TEMPLATES[ext];
        if (!template)
          throw Error(
            `Unsupported screenshot file type (${ext}). Must be one of ${Object.keys(RENDER_SCREENSHOT_JS_TEMPLATES).join(", ")}`,
          );

        return applyTemplateVars(template, {
          path,
        });
      },
    },
  },
  {
    name: "viteshot:resolve-virtual:messages",
    resolveId: {
      filter: { id: [/\/viteshot-virtual\/messages/] },
      handler: (id) => {
        const url = new URL(id, "http://localhost");
        const localeId = url.searchParams.get("id");
        if (!localeId)
          throw Error(`Required query param \"id\" not provided for ${id}`);

        return join(config.localesDir, localeId);
      },
    },
  },
];
