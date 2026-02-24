import INDEX from "../assets/index.html?raw" with { type: "text" };
import INDEX_JS from "../assets/index.js?raw" with { type: "text" };
import FAVICON_SVG from "../assets/favicon.svg?raw" with { type: "text" };

import type { PluginOption } from "vite";
import { toFilter } from "../utils";

const INDEX_JS_ID = "/@viteshot/index";

const FILTERS = [toFilter(INDEX_JS_ID)];

const CONTENT: Record<string, string> = {
  [INDEX_JS_ID]: INDEX_JS,
};

export function assetsPlugin(): PluginOption {
  return [
    {
      name: "viteshot:resolve-html",
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            if (req.originalUrl === "/favicon.svg") return res.end(FAVICON_SVG);

            if (req.originalUrl === "/")
              return res.end(
                await server.transformIndexHtml(req.originalUrl, INDEX),
              );

            return next();
          });
        };
      },
    },
    {
      name: "viteshot:resolve-js",
      resolveId: {
        filter: { id: FILTERS },
        handler: (id) => id,
      },
      load: {
        filter: { id: FILTERS },
        handler: (id) => CONTENT[id],
      },
    },
  ];
}
