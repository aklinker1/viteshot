<div align="center">

# viteshot

Build and generate store screenshots with code.

</div>

```sh
bunx viteshot init ./store
```

## Usage

The init command will generate the following structure:

```
<root>/
  store/
    locales/              -- optional
      en.json
      es.json
      ...
    screenshots/
      one@640x400.html
      two@1280x600.html
      ...
    viteshot.config.ts    -- optional
  package.json
```

Make sure you add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "store:dev": "viteshot dev ./store",
    "store:generate": "viteshot generate ./store",
  }
}
```

The final argument, in this case `./store`, indicates the directory to run `viteshot` inside of. You can name it whatever you want.

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

### Solid

TODO

### React

TODO

## Styling

1. Setup your framework (like installing the TailwindCSS Vite plugin)
2. In your screenshots file, `<link>` to your CSS file, import your CSS file, or import your UI framework's components

And that's it!

## Assets

Create an `assets` directory and reference them via `assets/<filename>`. Vite will load them.
