# Astro Default Layout

An unofficial plugin for [Astro](https://astro.build) that sets directory-based default layouts for Markdown pages.

Based on a [comment](https://github.com/withastro/astro/issues/397#issuecomment-1264718819) by [mrinestra](https://github.com/mrienstra).

## Installation

```bash
npm install astro-default-layout
```

## Configuration

Add the plugin to `markdown` options in your `astro.config.ts` file:

```ts
// astro.config.ts
import { defineConfig } from "astro/config";
import { defaultLayout } from "astro-default-layout";

export default defineConfig({
  markdown: {
    remarkPlugins: [defaultLayout],
    extendDefaultPlugins: true
  }
});
```

## Usage

### Main layout

Put your main layout in `/src/layouts/MainLayout.astro`

### Subdirectiories

Layout mapping is directory-based. For example if you want `/src/pages/posts/post.astro` to have a different layout, then you should make a new layout in `/src/layouts/posts/MainLayout.astro`
