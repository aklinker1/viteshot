import { access } from "node:fs/promises";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve, relative, join, basename } from "node:path";
import { styleText } from "node:util";

export async function init(_dir: string): Promise<void> {
  const absDir = resolve(_dir);
  const relativeDir = relative(process.cwd(), absDir);
  const dirBasename = basename(_dir);

  for (const [file, contents] of Object.entries(FILES)) {
    const path = join(absDir, file);
    const exists = await access(path).then(
      () => true,
      () => false,
    );

    if (exists) {
      process.stdout.write(`File ${file} already exists. Overwrite? (y/n) `);
      const answer = await waitForInput();
      if (answer.toLowerCase() !== "y") continue;
    }

    const parent = dirname(path);
    await mkdir(parent, { recursive: true });
    await writeFile(path, contents);
  }

  console.log(
    `\n${styleText(["bold", "cyan"], "ViteShot")} project initialized:\n`,
  );
  for (const file of Object.keys(FILES)) {
    console.log(
      `  ${styleText("dim", `./${relativeDir}/`)}${styleText(["bold", "blue"], file)}`,
    );
  }
  console.log("\nAdd the following scripts to your package.json:\n");
  console.log(`  "${dirBasename}:dev": "viteshot dev ${relativeDir}",`);
  console.log(`  "${dirBasename}:export": "viteshot export ${relativeDir}"\n`);
}

async function waitForInput(): Promise<string> {
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

const FILES: Record<string, string> = {
  "viteshot.config.ts": `import { defineConfig } from 'viteshot';

export default defineConfig({
  screenshots: {
    // Add CSS to the <head> of your design's HTML document
    css: ["assets/style.css"],

    // Other ViteShot config here
  },

  // Regular Vite config here
})
`,

  "assets/style.css": `/* Global styles here */
body {
  background: #181818;
  color: white;
}`,

  "designs/screenshot-1@600x480.html": `<style>
  /* Inline styles per-design here */
</style>

<div>
  <p>Screenshot design here</p>
  <p>{{translated}}</p>
</div>
`,
};
