---
title: Axis mark
---

By default SveltePlot will create axis marks automatically:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib/index.js';
    import { getContext } from 'svelte';
    import type { Datasets } from '$lib/types.js';
    const { aapl } = getContext<Datasets>('data');
</script>

<Plot grid testid="axis">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

You can turn the axes off individually by adding `axis: false` to the x and y scale options:

Or you can add the **AxisX** and **AxisY** marks explicitely for more options, such as
layering grids on top of other marks. Note that in this case, custom grid ticks are not synchronized
with the axes marks.

```svelte
<Plot frame x={{ domain: [0, 10] }} y={{ domain: [0, 5] }} marginBottom={40} marginRight={30}>
    <AxisX anchor="top" tickSize={10} tickFontSize="14px" />
    <AxisX stroke="cornflowerblue" fill="cornflowerblue" />
    <AxisY fill="green" anchor="right" tickSize={-5} tickPadding={10} />
    <AxisY stroke="magenta" fill="#dd0000" ticks={[0, 1.5, 2, 2.5, 4, 5]} />
</Plot>
```

The automatic ticks can be customized using the <b>tickSpacing</b> option:

```svelte
<Plot x={{ tickSpacing: 150 }} y={{ tickSpacing: 10 }} testid="tickspacing">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```
