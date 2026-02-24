declare module "*?raw" {
  const text: string;
  export default text;
}

declare module "viteshot-virtual/screenshots" {
  const screenshots: import("./core/get-screenshots").Screenshot[];
  export default screenshots;
}

declare module "viteshot-virtual/locales" {
  const locales: import("./core/get-locales").Locale[];
  export default locales;
}
