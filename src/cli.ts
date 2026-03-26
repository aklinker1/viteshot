#!/usr/bin/env node
import { createServer } from "./core/create-server";
import { exportScreenshots } from "./core/export-screenshots";
import {
  DEV_HELP_MESSAGE,
  GENERAL_HELP_MESSAGE,
  EXPORT_HELP_MESSAGE,
  INIT_HELP_MESSAGE,
} from "./core/help-messages";
import { styleText } from "node:util";
import { init } from "./core/init";

const DEFAULT_DIR = "store";

const [command, ...args] = process.argv.slice(2);

const showHelp = process.argv.includes("--help") || process.argv.includes("-h");

switch (command) {
  case "dev": {
    if (showHelp) {
      console.log(DEV_HELP_MESSAGE);
      process.exit(0);
    }

    const dir = args[0] ?? DEFAULT_DIR;
    const server = await createServer(dir);
    await server.listen();
    server.printUrls();
    break;
  }
  case "export": {
    if (showHelp) {
      console.log(EXPORT_HELP_MESSAGE);
      process.exit(0);
    }

    const dir = args[0] ?? DEFAULT_DIR;
    await exportScreenshots(dir);
    process.exit(0);
  }
  case "init": {
    if (showHelp) {
      console.log(INIT_HELP_MESSAGE);
      process.exit(0);
    }

    const dir = args[0] ?? DEFAULT_DIR;
    await init(dir);
    process.exit(0);
  }
  default: {
    if (showHelp) {
      console.log(GENERAL_HELP_MESSAGE);
      process.exit(0);
    }

    console.log(
      `${GENERAL_HELP_MESSAGE}\n\nUnknown command: ${styleText("yellow", command || "<none>")}`,
    );
    process.exit(1);
  }
}
