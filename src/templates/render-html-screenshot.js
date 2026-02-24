import HTML from "/@fs/{{path}}?raw";

export function renderScreenshot(container, messages) {
  container.innerHTML = Object.entries(messages).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
    HTML,
  );
}
