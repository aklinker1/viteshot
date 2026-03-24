import { defineConfig } from "../src";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  screenshotsConcurrency: 4,
  plugins: [vue(), react(), svelte()],
});
