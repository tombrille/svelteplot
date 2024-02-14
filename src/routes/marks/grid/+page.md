---
title: Grid mark
---

You can let SveltePlot create grids automatically for you by setting the `grid`
flag on the Plot:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib/index.js';
    
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="grid">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

You can turn the grids on individually using by adding `grid: true`to the x and y
scale options:

```svelte
<Plot x={{ grid: true }} />
<Plot y={{ grid: true }} />
```

Or you can add the **GridX** and **GridY** marks explicitely for more options, such as
layering grids on top of other marks. Note that in this case, custom grid ticks are not synchronized
with the axes marks.

```svelte
<Plot x={{ domain: [0, 5] }} testid="custom">
    <GridX stroke="lime" />
    <GridY stroke="magenta" ticks={[0, 1.5, 2, 2.5, 4, 5]} />
</Plot>
```

In the following bar chart we put two grids, one below the bars and one above:

```svelte live
<script>
    import { Plot, BarX, RuleX, GridX } from '$lib';
</script>

<Plot marginTop={0}>
    <GridX />
    <BarX data={[1.5, 2.5, 4.5, 4.7, 6.2, 6.8]} />
    <GridX stroke="var(--svelteplot-bg)" strokeOpacity={0.4} />
    <RuleX data={[0]} />
</Plot>
```

```svelte
<Plot marginTop={0}>
    <GridX />
    <BarX data={[1.5, 2.5, 4.5, 4.7, 6.2, 6.8]} />
    <GridX stroke="var(--svelteplot-bg)" strokeOpacity={0.4} />
    <RuleX data={[0]} />
</Plot>
```

The automatic ticks can be customized using the **tickSpacing** option:

```svelte
<Plot grid x={{ tickSpacing: 150 }} y={{ tickSpacing: 10 }} testid="tickspacing">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

## GridX

For showing vertical grid lines spread along the x axis.

## GridY

For showing horizontal grid lines spread along the x axis.
