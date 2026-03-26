import { defineConfig } from "../src";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  screenshots: {
    css: ["assets/styles.css"],
  },
  plugins: [vue(), react(), svelte()],
});
