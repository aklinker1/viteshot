import Component from "/@fs/{{path}}";
import { createApp } from "vue";

export function renderScreenshot(container, messages) {
  const app = createApp(Component, { t: messages });
  app.mount(container);
}
