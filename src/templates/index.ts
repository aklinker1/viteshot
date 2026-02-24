/**
 * Re-export all the files in src/templates directory as inline text.
 *
 * - When building for NPM, the files are bundled inline via the `?raw` suffix and
 *   a custom rolldown plugin.
 * - When developing this package, Bun uses the `with { type: "text" }` import
 *   specifier to import then as plain text, ignoring the `?raw` suffix.
 */
export { default as faviconSvgTemplate } from "./favicon.svg?raw" with { type: "text" };
export { default as dashboardHtmlTemplate } from "./dashboard.html?raw" with { type: "text" };
export { default as screenshotHtmlTemplate } from "./screenshot.html?raw" with { type: "text" };
export { default as renderHtmlScreenshotJsTemplate } from "./render-html-screenshot.js?raw" with { type: "text" };
