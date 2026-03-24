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
   bun add -D vite @aklinker1/viteshot
   ```

2. Initialize the `./store` directory:

   ```sh
   bun viteshot init ./store
   ```

3. Add the following scripts to your `package.json`:

   ```sh
   {
     "scripts": {
       "store:dev": "viteshot dev ./store",
       "store:generate": "viteshot generate ./store",
     }
   }
   ```

Then generate your screenshots with `bun store:generate`! Screenshots will be output to `store/screenshots`.

## Design Files

Your screenshot designs go in `store/designs/{name}@{width}x{height}.{ext}`.

- `{name}`: The name of your screenshot, it can be anything (ex: "small-marquee", "screenshot-1", etc).
- `{width}x{height}`: The size your screenshot should be rendered at (ex: "1280x600", "640x400").
- `{ext}`: ViteShot supports a variety of file extensions, so you can build your designs using your preferred frontend framework!

### HTML

1. Define an HTML fragment, this will be added to the `body` element automatically.
2. `<link>` to your CSS for styles or use an inline `<style>` block
3. Translations can be accessed using the handlebars syntax

```html
<!-- designs/example@640x400.html-->
<link rel="stylesheet" href="assets/tailwind.css" />
<div>{{path.to.translation}}</div>
```

> [!NOTE]
>
> You don't need a frontend framework to build a simple static layout. Using HTML design files is recommended.

### Vue

1. Add `@vitejs/plugin-vue` to `store/viteshot.config.ts`
2. Define your screenshot in a `.vue` file
3. Import any styles, or use Vue's `<style>` block
4. Use the `t` prop to access translations for the current locale

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

> [!WARN]
>
> Experimental, not 100% working yet.

1. Add `@sveltejs/vite-plugin-svelte` to `store/viteshot.config.ts`
2. Export your component as the default module from your `.svelte` file
3. Import any styles or use an inline `<style>` block
4. Use the `t` prop to access translations for the current locale

```svelte
<!-- store/designs/example@640x480.svelte -->
<script lang="ts">
  import "../assets/tailwind.css"

  export let t: Record<string, any>
</script>

<p>{t.path.to.translation}</p>
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
  return <p>{t.path.to.translation}</p>;
}
```

## Styling

1. Setup your framework (like installing the TailwindCSS Vite plugin)
2. In your screenshots file, `<link>` to your CSS file, import your CSS file, or import your UI framework's components

And that's it!

## Assets

Create an `assets` directory and reference them via `assets/<filename>`. Vite will load them.
