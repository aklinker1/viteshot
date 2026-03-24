import HTML from "/@fs/{{path}}?raw";

export function renderScreenshot(container, messages) {
  container.innerHTML = Object.entries(messages).reduce(
    (text, [key, value]) =>
      text.replace(new RegExp(`\\{\\{\\s*?${key}\\s*?\\}\\}`, "g"), value),
    HTML,
  );
}
