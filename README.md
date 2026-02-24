# viteshot

Manage and generate screenshots for your app store listing from code.

```sh
bun add -D vite viteshot
pnpm add -D vite viteshot
npm add -D vite viteshot
yarn add -D vite viteshot
```

## Usage

Directory structure:

```
<root>/
  store/
    locales/             -- optional
      en.json
      es.json
      ...
    screenshots/
      one@640x400.html
      two@1280x600.html
      ...
    viteshot.config.ts   -- optional
  package.json
```

Then add these scripts to your package.json:

```json
{
  "scripts": {
    "store:dev": "viteshot dev store",
    "store:generate": "viteshot generate store",
  }
}
```

The final argument, in this case "store", indicates the directory to run `viteshot` inside of. You can name it whatever you want.

## Screenshot File Types

### HTML (Recommended)

You can use simple HTML files for screenshots:

```html
<div>
  My Screenshot design
</div>
```

Note that your screenshot should be a HTML fragment, not a full HTML document. You can have as many root elements as you like, including `<style>` or `<link>` elements:

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
