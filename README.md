<div align="center">

# ViteShot

Build and generate store screenshots and promo images with code, powered by Vite.

</div>

## Why?

With AI, it's common for developers with less design experience to generate store screenshots and promo images. However, one shot image generation models aren't very good at this yet.

However, AI is really good at building *simple* UIs with HTML! ViteShot provides a simple way for agents in your preferred dev environment to create and generate images in a structured, easy-to-iterate way.

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

Then generate your screenshots with `bun store:generate`! Screenshots will be output to `store/screenshots`.

## Design Files

Your screenshot designs go in `store/designs/{name}@{width}x{height}.{ext}`.

- `{name}`: The name of your screenshot, it can be anything (ex: "small-marquee", "screenshot-1", etc).
- `{width}x{height}`: The size your screenshot should be rendered at (ex: "1280x600", "640x400").
- `{ext}`: ViteShot supports a variety of file extensions, so you can build your designs using your preferred frontend framework!

### HTML (Recommended)

You don't need a frontend framework to build a simple static layout.

```html
<div>My screenshot design</div>
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
