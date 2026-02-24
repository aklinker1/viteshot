<div align="center">

# ViteShot

Build and generate store screenshots with code, powered by Vite.

</div>

## Get Started

1. Add Vite and ViteShot as dev dependencies to your project:

   ```sh
   bun add -D vite viteshot
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

Then generate your screenshots with `bun store:generate`! Screenshots will be output to `store/output`.

## Screenshot File Types

### HTML (Recommended)

You can use simple HTML files for screenshots. This is recommended because screenshots are static, you don't need a frontend framework to create a static layout.

```html
<div>
  My Screenshot design
</div>
```

Note that your screenshot should be an HTML fragment, not a full HTML document. You can have as many root elements as you like, including `<style>` or `<link>` elements:

```html
<link rel="stylesheet" href="assets/tailwind.css">

<div class="flex flex-col gap-4">
  <h1>Title</h1>
  <p>Text</p>
</div>
```

### Vue

TODO

### Svelte

TODO

### React

TODO

## Styling

1. Setup your framework (like installing the TailwindCSS Vite plugin)
2. In your screenshots file, `<link>` to your CSS file, import your CSS file, or import your UI framework's components

And that's it!

## Assets

Create an `assets` directory and reference them via `assets/<filename>`. Vite will load them.
