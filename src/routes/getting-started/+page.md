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

## Use SveltePlot in Svelte 5 projects

:::warning
Note that while we're figuring out the best license for SveltePlot, there's no
recent release on npm, yet.
:::

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

## Use SveltePlot in vanilla HTML

The core idea of SveltePlot is to be used inside Svelte applications. Svelte being Svelte, nothing is stopping you from pre-compiling your visualization code (including the Svelte runtime) as a standalone JavaScript bundle and embedding it anywhere you want.

All you need for this is to clone this starter repo (TODO) and run `npm run build`.

## Use SveltePlot in React, Vue, etc.

I wouldn't recommend this. Just use [Observable Plot](https://observablehq.com/plot/getting-started#plot-in-react) directly.
