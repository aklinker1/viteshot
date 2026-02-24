import { createServer } from "./core/create-server";
import { generateScreenshots } from "./core/generate-screenshots";

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "dev":
    const server = await createServer("example");
    await server.listen();
    server.printUrls();
    break;
  case "generate":
    await generateScreenshots("example");
    process.exit(0);
  default:
    break;
}
