import { mkdir, rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { withLock } from "superlock";
import { createServer, type ViteDevServer } from "vite";
import { openChromium, type CdpBrowser } from "./cdp";
import { resolveConfig } from "./config";
import { getLocales, type Locale } from "./get-locales";
import {
  getScreenshots,
  logInvalidDesignFiles,
  type Screenshot,
} from "./get-screenshots";

export async function exportScreenshots(dir?: string): Promise<void> {
  const config = await resolveConfig(dir);
  await logInvalidDesignFiles(config.designsDir);

  const cwd = process.cwd();
  const screenshots = await getScreenshots(config.designsDir);
  const locales = await getLocales(config.localesDir);

  console.log(
    `\n\x1b[1mExporting ${screenshots.length * (locales.length || 1)} screenshots...\x1b[0m\n`,
  );

  let server: ViteDevServer | undefined;
  let browser: CdpBrowser | undefined;

  try {
    await rm(config.exportsDir, { recursive: true, force: true });
    await mkdir(config.exportsDir, { recursive: true });

    server = await createServer(config.vite);
    server.listen();
    const { port } = server.config.server;

    browser = await openChromium({
      executablePath: process.env.VITESHOT_CHROME_PATH,
      ...config.cdp,
      // Uncomment to debug
      // headless: false,
    });

    const renderLock = withLock(config.renderConcurrency);

    const render = async ({
      screenshot,
      locale,
    }: {
      screenshot: Screenshot;
      locale: Locale;
    }): Promise<void> => {
      const outputId =
        (locale ? `${locale.language}/` : "") + screenshot.name + ".webp";
      const outputPath = join(config.exportsDir, outputId);
      const outputDir = dirname(outputPath);
      await mkdir(outputDir, { recursive: true });

      const page = await browser!.newPage(
        `http://localhost:${port}/screenshot/${locale?.id ?? "null"}/${screenshot.id}.html`,
      );
      await page.screenshot(outputPath, screenshot.width, screenshot.height);
      console.log(
        `  ✅ \x1b[2m./${relative(cwd, config.exportsDir)}/\x1b[0m\x1b[36m${outputId}\x1b[0m`,
      );
      await page.close();
    };

    await Promise.all(
      screenshots
        .flatMap((screenshot) =>
          locales.map((locale) => ({ screenshot, locale })),
        )
        .map((item) => renderLock(() => render(item))),
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
    browser?.close();
    await server?.close().catch(() => {});

    console.log("");
  }
}
