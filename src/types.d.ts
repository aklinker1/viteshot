declare module "*?raw" {
  const text: string;
  export default text;
}

declare type Screenshot = {
  id: string;
  path: string;
  ext: string;
  filenameNoExt: string;
  name: string;
  size: string | undefined;
  width: number | undefined;
  height: number | undefined;
};
