import puppeteer from "puppeteer-core";
import { resolveConfig } from "./config";
import { getScreenshots } from "./get-screenshots";
import { createServer, type ViteDevServer } from "vite";
import type { Browser } from "puppeteer-core";
import { mkdir, rm } from "node:fs/promises";
import pMap from "p-map";
import { relative, join, dirname } from "node:path";
import { Mutex } from "async-mutex";
import { getLocales } from "./get-locales";

export async function generateScreenshots(dir?: string): Promise<void> {
  const config = await resolveConfig(dir);
  const cwd = process.cwd();
  const screenshots = await getScreenshots(config.designsDir);
  const locales = await getLocales(config.localesDir);

  console.log(
    `\n\x1b[1mGenerating ${screenshots.length * (locales.length || 1)} screenshots...\x1b[0m\n`,
  );

  let server: ViteDevServer | undefined;
  let browser: Browser | undefined;

  try {
    await rm(config.screenshotsDir, { recursive: true, force: true });
    await mkdir(config.screenshotsDir, { recursive: true });

    server = await createServer(config.vite);
    server.listen();
    const { port } = server.config.server;

    browser = await puppeteer.launch({
      executablePath: process.env.VITESHOT_CHROME_PATH,
      // Uncomment to debug
      // headless: false,
      // slowMo: 1000,
    });

    const screenshotMutex = new Mutex();

    await pMap(
      screenshots.flatMap((screenshot) =>
        locales.map((locale) => ({ screenshot, locale })),
      ),
      async ({ screenshot, locale }) => {
        const outputId =
          (locale ? `${locale.language}/` : "") +
          screenshot.id.slice(0, -screenshot.ext.length) +
          ".webp";
        const outputPath = join(config.screenshotsDir, outputId);
        const outputDir = dirname(outputPath);
        await mkdir(outputDir, { recursive: true });

        const page = await browser!.newPage({
          // Don't switch the active tab to this tab when opening - this
          // prevents accessive active tab changes, only switching to a tab to
          // take a screenshot.
          background: true,
        });
        await page.goto(
          `http://localhost:${port}/screenshot/${locale?.id ?? "null"}/${screenshot.id}`,
          { waitUntil: "networkidle0", timeout: 5e3 },
        );
        await screenshotMutex.runExclusive(async () => {
          await page.bringToFront();
          await page.screenshot({
            captureBeyondViewport: true,
            clip: {
              x: 0,
              y: 0,
              width: screenshot.width!,
              height: screenshot.height!,
            },
            type: "webp",
            quality: 100,
            path: outputPath,
          });
        });
        console.log(
          `  ✅ \x1b[2m./${relative(cwd, config.screenshotsDir)}/\x1b[0m\x1b[36m${outputId}\x1b[0m`,
        );
        await page.close();
      },
      {
        concurrency: config.screenshotsConcurrency,
        stopOnError: true,
      },
    );
  } catch (err: any) {
    if (
      err?.message ===
      "An `executablePath` or `channel` must be specified for `puppeteer-core`"
    ) {
      throw Error(
        `Chromium not detected. Set the VITESHOT_CHROME_PATH env var to your Chromium executable.`,
      );
    } else {
      throw err;
    }
  } finally {
    await browser?.close().catch(() => {});
    await server?.close().catch(() => {});

    console.log("");
  }
}
