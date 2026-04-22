import { ChildProcess, spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { viteshotDebug } from "./debug";

const debug = viteshotDebug.extend("cdp");

export type ScreenshotOptions = {
  /** @default "webp" */
  type?: "webp" | "png" | "jpeg";
  /** Defaults to 100 for `webp` and `jpeg`, ignored for `png` */
  quality?: number;
};

export interface CdpOptions {
  executablePath: string | undefined;
  headless?: boolean;
  screenshot?: ScreenshotOptions;
}

//
// CDP BROWSER
//

export interface CdpBrowser {
  newPage(url: string): Promise<CdpPage>;
  close(): void;
}

export async function openChromium(options: CdpOptions): Promise<CdpBrowser> {
  if (!options.executablePath) {
    throw Error("chromiumPath is required");
  }

  const args = [
    "--remote-debugging-port=0", // Let Chrome pick a port
    "--remote-debugging-pipe",
    "--user-data-dir=node_modules/.viteshot/chromium-user",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-extensions",
    options.headless !== false ? "--headless=new" : "",
  ].filter(Boolean);

  const chromiumProcess = spawn(options.executablePath, args, {
    stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
  });

  if (process.env.DEV) {
    for (let i = 0; i < chromiumProcess.stdio.length; i++) {
      const debugFd = debug.extend(`fd${i}`);
      chromiumProcess.stdio[i]?.addListener("data", (data) => {
        debugFd(data.toString().trim());
      });
    }
  }

  const wsEndpoint = await getWsEndpoint(chromiumProcess);

  const browserAbortController = new AbortController();
  const browserAbortSignal = browserAbortController.signal;

  const newPage: CdpBrowser["newPage"] = (url) => {
    return createPage({
      wsEndpoint,
      url,
      screenshot: options.screenshot,
      browserAbortSignal,
    });
  };

  const close: CdpBrowser["close"] = () => {
    chromiumProcess.kill();
    browserAbortController.abort("Browser closed");
  };

  return {
    newPage,
    close,
  };
}

//
// CDP PAGE
//

export interface CdpPage {
  screenshot(
    this: void,
    path: string,
    width: number,
    height: number,
  ): Promise<void>;
  close(this: void): Promise<void>;
}

async function createPage({
  wsEndpoint,
  url,
  screenshot: screenshotOptions,
  browserAbortSignal,
}: {
  wsEndpoint: string;
  url: string;
  screenshot?: ScreenshotOptions;
  browserAbortSignal: AbortSignal;
}): Promise<CdpPage> {
  const pageAbortController = new AbortController();
  const pageAbortSignal = pageAbortController.signal;

  browserAbortSignal.onabort = () =>
    pageAbortController.abort("Browser closed");

  const cdp = await createCdpClient(wsEndpoint, pageAbortSignal);
  const { targetId } = await cdp.sendCommand<{ targetId: string }>(
    "Target.createTarget",
    // TODO: try setting URL here instead of calling `Page.navigate`
    { url: "" },
  );
  const { sessionId } = await cdp.sendCommand<{ sessionId: string }>(
    "Target.attachToTarget",
    { targetId, flatten: true },
  );

  await cdp.sendCommand("Page.enable", {}, sessionId);
  await cdp.sendCommand("Network.enable", {}, sessionId);

  // return {
  //   close: async () => {
  //     await cdp.sendCommand("Page.close", {}, sessionId).catch(() => {
  //       // ignore errors
  //     });
  //     await cdp
  //       .sendCommand("Target.closeTarget", { targetId }, sessionId)
  //       .catch(() => {
  //         // ignore errors
  //       });
  //     cdp.close();
  //   },
  //   screenshot: async () => {},
  // };

  const loaded = cdp.waitForEvent("Page.loadEventFired", sessionId);
  await cdp.sendCommand("Page.navigate", { url }, sessionId);
  await loaded;

  const screenshot: CdpPage["screenshot"] = async (path, width, height) => {
    pageAbortSignal.throwIfAborted();

    const { data } = await cdp.sendCommand<{ data: string }>(
      "Page.captureScreenshot",
      {
        captureBeyondViewport: true,
        format: screenshotOptions?.type ?? "png",
        quality:
          screenshotOptions?.type === "png"
            ? undefined
            : screenshotOptions?.quality,
        clip: { x: 0, y: 0, width, height, scale: 1 },
      },
      sessionId,
    );

    const buffer = Buffer.from(data, "base64");
    await writeFile(path, buffer);
  };

  const close = async () => {
    if (!pageAbortSignal.aborted) {
      await cdp
        .sendCommand("Target.closeTarget", { targetId }, sessionId)
        .catch((err) => {
          debug("Target.closeTarget error: " + err.message);
        });
      await cdp.sendCommand("Page.close", {}, sessionId).catch((err) => {
        debug("Page.close error: " + err.message);
      });
    }
    cdp.close();
  };

  pageAbortSignal.onabort = close;

  return {
    screenshot,
    close,
  };
}

//
// CDP CLIENT
//

interface CdpClient {
  sendCommand<TResult>(
    this: void,
    method: string,
    params?: Record<string, any>,
    sessionId?: string,
  ): Promise<TResult>;
  waitForEvent<TParams>(
    this: void,
    event: string,
    sessionId?: string,
  ): Promise<TParams>;
  close(this: void): void;
}

async function createCdpClient(
  wsEndpoint: string,
  abortSignal: AbortSignal,
): Promise<CdpClient> {
  const ws = new WebSocket(wsEndpoint);
  await waitForWebSocketReady(ws);

  let idSeq = 0;
  const callbacks: Record<
    number,
    { resolve: (res: unknown) => void; reject: (err: Error) => void }
  > = Object.create(null);

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data.toString());
    if (msg.id == null || !callbacks[msg.id]) return;

    const { resolve, reject } = callbacks[msg.id]!;
    delete callbacks[msg.id];

    if (msg.error) reject(new Error(msg.error.message, { cause: msg }));
    else resolve(msg.result);
  });

  const sendCommand: CdpClient["sendCommand"] = async (
    method,
    params,
    sessionId,
  ) => {
    abortSignal.throwIfAborted();

    const id = ++idSeq;
    return new Promise<any>((resolve, reject) => {
      callbacks[id] = { resolve, reject };
      const msg: Record<string, any> = { id, method, params };
      if (sessionId) msg.sessionId = sessionId;
      ws.send(JSON.stringify(msg));
    });
  };

  const waitForEvent: CdpClient["waitForEvent"] = (event, sessionId) => {
    abortSignal.throwIfAborted();

    return new Promise<any>((resolve, reject) => {
      const cleanup = () => {
        ws.removeEventListener("message", handler);
        clearTimeout(timeout);
      };
      const handler = (e: MessageEvent): void => {
        const msg = JSON.parse(e.data.toString());
        if (msg.method !== event) return;
        if (sessionId && msg.sessionId !== sessionId) return;

        cleanup();
        resolve(msg.params);
      };
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("timeout waiting for event"));
      }, 10e3);

      ws.addEventListener("message", handler);
    });
  };

  const close: CdpClient["close"] = () => {
    ws.close();
  };

  abortSignal.onabort = close;

  return {
    sendCommand,
    waitForEvent,
    close,
  };
}

//
// UTILS
//

function getWsEndpoint(chromiumProcess: ChildProcess): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    chromiumProcess.stderr?.on("data", (data: Buffer) => {
      const match = data.toString().match(/ws:\/\/[^\s]+/);
      if (match) resolve(match[0]);
    });
    chromiumProcess.on("error", reject);
    setTimeout(
      () => reject(new Error("Timeout waiting for Chrome to start")),
      10e3,
    );
  });
}

async function waitForWebSocketReady(ws: WebSocket): Promise<void> {
  if (ws.readyState === WebSocket.OPEN) return;
  return new Promise((resolve) =>
    ws.addEventListener("open", () => resolve(), { once: true }),
  );
}
