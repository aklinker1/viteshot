<div align="center">

# ViteShot

Generate store screenshots and promo images with code, powered by Vite.

<img width="1241" height="1243" alt="image" src="https://github.com/user-attachments/assets/c6eb4360-f367-4c37-8132-c675c7afe212" />

</div>

## Why?

With AI, it's common for developers with less design experience to generate store screenshots and promo images. However, one shot image generation models aren't very good at this yet.

However, AI is really good at building _simple_ UIs with HTML! ViteShot provides a simple way for agents in your preferred dev environment to create and generate images in a structured, easy-to-iterate way.

## Get Started

1. Add Vite and ViteShot as dev dependencies to your project:

   ```sh
   bun add -D @aklinker1/viteshot vite
   ```

2. Initialize the `./store` directory:

   ```sh
   bun viteshot init store
   ```

3. Add the following scripts to your `package.json`:

   ```sh
   {
     "scripts": {
       "viteshot:dev": "viteshot dev store",
       "viteshot:generate": "viteshot generate store",
     }
   }
   ```

Then generate your screenshots with `bun viteshot:generate`! Screenshots will be output to `store/screenshots`.

## Design Files

Your screenshot designs go in `store/designs/{name}@{width}x{height}.{ext}`.

- `{name}`: The name of your screenshot, it can be anything (ex: "small-marquee", "screenshot-1", etc).
- `{width}x{height}`: The size your screenshot should be rendered at (ex: "1280x600", "640x400").
- `{ext}`: ViteShot supports a variety of file extensions, so you can build your designs using your preferred frontend framework!

### HTML

1. Define an HTML fragment, this will be added to the `body` element automatically.
2. Translations can be accessed using the handlebars syntax

```html
<!-- designs/example@640x400.html-->
<p>{{path.to.message}}</p>
```

> [!NOTE]
>
> You don't need a frontend framework to build a simple static layout. Using HTML design files is recommended.

### Vue

1. Add `@vitejs/plugin-vue` to `store/viteshot.config.ts`
2. Add a `.vue` design file
3. Use the `t` prop to access translations for the current locale

```vue
<!-- store/designs/example@640x480.vue -->
<script lang="ts" setup>
import "../assets/tailwind.css";

defineProps<{
  t: Record<string, any>;
}>();
</script>

<template>
  <p>{{ t.path.to.message }}</p>
</template>
```

### Svelte

1. Add `@sveltejs/vite-plugin-svelte` to `store/viteshot.config.ts`
2. Add a `.svelte` design file
3. Use the `t` prop to access translations for the current locale

```svelte
<!-- store/designs/example@640x480.svelte -->
<script lang="ts">
  export let t: Record<string, any>
</script>

<p>{t.path.to.message}</p>
```

### React

1. Add `@vitejs/plugin-react` to `store/viteshot.config.ts`
2. Export your component as the default module from your `.tsx` or `.jsx` file
3. Import any styles
4. Use the `t` prop to access translations for the current locale

```tsx
// store/designs/example@640x400.tsx
import React from "react";
import "../assets/tailwind.css";

export default function (props: { t: Record<string, any> }) {
  return <p>{t.path.to.message}</p>;
}
```

## Styling

There are a few ways of adding CSS to your screenshots:

1. Add global, shared CSS to your `viteshot.config.ts` file:

   ```ts
   import { defineConfig } from "@aklinker1/viteshot";

   export default defineConfig({
     screenshots: {
       css: ["assets/tailwind.css"], // Supports SCSS, SASS, etc
     },
   });
   ```

2. Import your CSS files from inside your design file

   ```tsx
   import "../assets/tailwind.css";

   export default function () {
     return <div>...</div>;
   }
   ```

3. Use inline `<style>` blocks

   ```html
   <style>
     ...
   </style>
   
   <div>...</div>
   ```

| Method           | HTML | Vue | Svelte | React |
| ---------------- | :--: | :-: | :----: | :---: |
| Add `css` config |  ✅  | ✅  |   ✅   |  ✅   |
| Import CSS file  |  ❌  | ✅  |   ✅   |  ✅   |
| Inline `<style>` |  ✅  | ✅  |   ✅   |  ❌   |

## Assets

Vite allows you to put assets in two folders:

1. `assets/`
2. `public/`

For HTML designs, you need to put files in `public/`, but for the other supported frameworks, you can use `assets/` and import them into your design file.

| Method    | HTML | Vue | Svelte | React |
| --------- | :--: | :-: | :----: | :---: |
| `assets/  |  ❌  | ✅  |   ✅   |  ✅   |
| `public/` |  ✅  | ✅  |   ✅   |  ✅   |

Review [Vite's docs](https://vite.dev/guide/assets) for how to import or use assets from each directory.
