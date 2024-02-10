---
title: Grid mark
---

You can let SveltePlot create grids automatically for you by setting the `grid`
flag on the Plot:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib/index.js';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { aapl } = $derived(getData());
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

The automatic ticks can be customized using the **tickSpacing** option:

```svelte
<Plot grid x={{ tickSpacing: 150 }} y={{ tickSpacing: 10 }} testid="tickspacing">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```
