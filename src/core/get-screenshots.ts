import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import natsort from "natural-compare-lite";
import { styleText } from "node:util";

export type Screenshot = {
  id: string;
  path: string;
  ext: string;
  name: string;
  size: string;
  width: number;
  height: number;
};

const FILENAME_REGEX =
  /^(?<name>.*?)@(?<size>(?<width>[0-9]+)x(?<height>[0-9]+)).(?<ext>.*)$/;

export async function getScreenshots(
  designsDir: string,
): Promise<Screenshot[]> {
  const allFiles = await readdir(designsDir, {
    recursive: true,
    withFileTypes: true,
  });

  return allFiles
    .filter((file) => file.isFile())
    .map<Screenshot | undefined>((file) => {
      const match = FILENAME_REGEX.exec(file.name);
      if (!match) return;

      const path = join(file.parentPath, file.name);
      const name = match.groups!.name!;
      const size = match.groups!.size!;
      const width = Number(match.groups!.width!);
      const height = Number(match.groups!.height!);
      const ext = match.groups!.ext!;

      return {
        id: relative(designsDir, path),
        path,
        ext,
        name,
        size,
        width,
        height,
      };
    })
    .filter((file) => file != null)
    .toSorted((a, b) => natsort(a.id, b.id));
}

export async function logInvalidDesignFiles(designsDir: string): Promise<void> {
  const allFiles = await readdir(designsDir, {
    recursive: true,
    withFileTypes: true,
  });

  const invalid = allFiles
    .filter((file) => file.isFile())
    .map((file) => (FILENAME_REGEX.exec(file.name) ? undefined : file))
    .filter((file) => file != null)
    .map((file) => file.name);

  if (invalid.length > 0) {
    console.warn(
      `${styleText(["bold", "yellow"], "Invalid design file names:")}\n  - ${invalid.join("\n  - ")}`,
    );
  }
}
