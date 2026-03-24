import Component from "/@fs/{{path}}";
import { mount } from "svelte";

export function renderScreenshot(container, messages) {
  console.log("svelte", container);

  const app = mount(Component, {
    target: container,
    props: { t: messages },
  });
  console.log(app);
}
