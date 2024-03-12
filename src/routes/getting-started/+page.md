---
title: Getting started
---

:::warning
Unfortunately, SveltePlot **is not ready for use** yet. Most of the existing features are implemented only half-way and there are countless bugs in the reactive data flows.
:::

## Try online

You can use SveltePlot inside any platform that supports Svelte 5, such as [StackBlitz](https://stackblitz.com/edit/vitejs-vite-o4p5ss?file=src%2Fassets%2Fco2.csv,src%2FApp.svelte&terminal=dev).

```svelte
<script>
    import { Plot } from 'svelteplot';
</script>
```

## Use SveltePlot in Svelte 5

Just install SveltePlot via `npm` or `pnpm`, and import and use the components!

```sh
npm install svelteplot
# or
pnpm add svelteplot
```

```svelte live
<script>
    import { Plot, BarX } from '$lib/index';
</script>

<Plot grid testid="four-bars">
    <BarX data={[1, 2, 3, 4]} />
</Plot>
```

```svelte
<script>
    import { Plot, BarX } from 'svelteplot';
</script>

<Plot grid>
    <BarX data={[1, 2, 3, 4]} />
</Plot>
```

## Use SveltePlot in Svelte 4

Unfortunately, SveltePlot is not compatible with Svelte 4 projects due to it's heavy use of [runes](https://svelte-5-preview.vercel.app/docs/runes). However, upgrading your project to Svelte 5 should be relatively easy since it is mostly backwards compatible. This means that the majority of your existing code should work without major modifications.

To upgrade to Svelte 5, you can follow the official [Svelte documentation](https://svelte-5-preview.vercel.app/docs/introduction) on how to upgrade your project.

## Use SveltePlot in vanilla HTML

The core idea of SveltePlot is to be used inside Svelte applications, but Svelte being Svelte, nothing is stopping you from pre-compiling your visualization code (including the Svelte runtime) as a standalone JavaScript bundle and embedding it anywhere you want.

All you need for this is to clone this starter repo (TODO) and run `npm run build`.

## Use SveltePlot in React, Vue, etc.

I wouldn't recommend this. Just use [Observable Plot](https://observablehq.com/plot/getting-started#plot-in-react) directly.
