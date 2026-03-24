#!/usr/bin/env node
import { createServer } from "./core/create-server";
import { generateScreenshots } from "./core/generate-screenshots";

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "dev": {
    const dir = args[0] ?? "store";
    const server = await createServer(dir);
    await server.listen();
    server.printUrls();
    break;
  }
  case "generate": {
    const dir = args[0] ?? "store";
    await generateScreenshots(dir);
    process.exit(0);
  }
  case "init":
  default:
    break;
}
