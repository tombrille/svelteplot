---
title: Getting started
---

## Try online

You can use SveltePlot inside any platform that supports Svelte 5, such as StackBlitz, SvelteLab, or the regular Svelte REPLs.

```svelte
<script>
    import { Plot } from 'svelteplot';
</script>
```

## Use SveltePlot in Svelte 5 projects

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

<Plot grid>
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
