import { version } from "../../package.json";
import { styleText } from "node:util";

const hash = process.env.COMMIT_HASH;

export const GENERAL_HELP_MESSAGE = `${styleText(["bold", "cyan"], "ViteShot")} generates screenshots from code. ${styleText("dim", `(${version}+${hash})`)}

${styleText("bold", "Usage: viteshot <command>")} ${styleText(["bold", "blue"], "[...flags]")} ${styleText("bold", "[...args]")}

${styleText("bold", "Commands")}

  ${styleText(["bold", "magenta"], "dev")}       ${styleText("dim", "store")}            Preview and update your screenshots
  ${styleText(["bold", "magenta"], "generate")}  ${styleText("dim", "store")}            Generate screenshots
  ${styleText(["bold", "magenta"], "init")}      ${styleText("dim", "store")}            Initialize viteshot in your project

  ${styleText("dim", "<command>")} ${styleText(["bold", "blue"], "--help")}           Print help text for a command
`;
const FOLDER_ARG = `${styleText("dim", "<folder>")}    The folder containing your Viteshot project ${styleText("dim", "(default: ./store)")}`;

export const DEV_HELP_MESSAGE = `${styleText("bold", "Usage:")} ${styleText(["bold", "green"], "viteshot dev")} ${styleText("bold", "[<folder>]")}
  Spin up the Vite dev server for your project.

${styleText("bold", "Args:")}

  ${FOLDER_ARG}

${styleText("bold", "Examples:")}
  ${styleText(["bold", "green"], "viteshot init")}
  ${styleText(["bold", "green"], "viteshot init")} promos
`;

export const GENERATE_HELP_MESSAGE = `
${styleText("bold", "Usage:")} ${styleText(["bold", "green"], "viteshot generate")} ${styleText("bold", "[<folder>]")}
  Generate screenshots from your Viteshot project.

${styleText("bold", "Args:")}

  ${FOLDER_ARG}

${styleText("bold", "Examples:")}
  ${styleText(["bold", "green"], "viteshot generate")}
  ${styleText(["bold", "green"], "viteshot generate")} promos
`;

export const INIT_HELP_MESSAGE = `
${styleText("bold", "Usage:")} ${styleText(["bold", "green"], "viteshot init")} ${styleText("bold", "[<folder>]")}
  Initialize viteshot in your project.

${styleText("bold", "Args:")}

  ${FOLDER_ARG}

${styleText("bold", "Examples:")}
  ${styleText(["bold", "green"], "viteshot init")}
  ${styleText(["bold", "green"], "viteshot init")} promos
`;
