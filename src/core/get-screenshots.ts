import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import natsort from "natural-compare-lite";

export type Screenshot = {
  id: string;
  path: string;
  ext: string;
  filenameNoExt: string;
  name: string;
  size: string | undefined;
  width: number | undefined;
  height: number | undefined;
};

export async function getScreenshots(
  designsDir: string,
): Promise<Screenshot[]> {
  const allFiles = await readdir(designsDir, {
    recursive: true,
    withFileTypes: true,
  });

  return allFiles
    .filter((file) => file.isFile())
    .map<Screenshot>((file) => {
      const path = join(file.parentPath, file.name);
      const ext = extname(file.name);
      const filenameNoExt = file.name.slice(0, -ext.length);
      const [name, size] = filenameNoExt.split("@", 2);
      const [width, height] = size
        ? size.split("x").map((value) => Number(value))
        : [];

      return {
        id: relative(designsDir, path),
        path,
        ext,
        filenameNoExt,
        name: name!,
        size,
        width,
        height,
      };
    })
    .toSorted((a, b) => natsort(a.id, b.id));
}
