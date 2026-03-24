import Component from "/@fs/{{path}}";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

export function renderScreenshot(container, messages) {
  const root = createRoot(container);
  root.render(createElement(Component, { t: messages }));
}
