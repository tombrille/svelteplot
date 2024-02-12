---
title: Stack transform
---

The **stack transform** comes in two orientations: [stackY](/transforms/stack#stackY) replaces **y** with **y1** and **y2** to form vertical↑ stacks grouped on **x**, while [stackX](/transforms/stack#stackX) replaces **x** with **x1** and **x2** for horizontal→ stacks grouped on **y**. In effect, stacking transforms a _length_ into _lower_ and _upper_ positions: the upper position of each element equals the lower position of the next element in the stack. Stacking makes it easier to perceive a total while still showing its parts.

For example, below is a stacked area chart of [deaths in the Crimean War](https://en.wikipedia.org/wiki/Florence_Nightingale#Crimean_War) — predominantly from disease — using Florence Nightingale’s data.

```svelte live
<script lang="ts">
    import { getContext } from 'svelte';
    import { Plot, AreaY } from '$lib';

    const getData = getContext('data');
    let { crimea } = $derived(getData());
</script>

<Plot grid color={{ legend: true }}>
    <AreaY data={crimea} x="date" y="deaths" fill="cause" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true }}>
    <AreaY data={crimea} x="date" y="deaths" fill="cause" />
</Plot>
```

The [AreaY mark](/marks/area) applies the stackY transform implicitly if you do not specify either **y1** or **y2**. The same applies to [BarY](/marks/bar) and [RectY](/marks/rect). You can invoke the stack transform explicitly to produce an identical chart.

```svelte live
<script lang="ts">
    import { getContext } from 'svelte';
    import { Plot, Area, stackY } from '$lib';

    const getData = getContext('data');
    let { crimea } = $derived(getData());
</script>

<Plot grid color={{ legend: true }}>
    <Area {...stackY({ data: crimea, x1: 'date', y: 'deaths', fill: 'cause' })} />
</Plot>
```

```svelte
<script>
    import { Plot, Area, stackY } from 'svelteplot';
</script>

<Plot grid color={{ legend: true }}>
    <Area {...stackY({ data: crimea, x1: 'date', y: 'deaths', fill: 'cause' })} />
</Plot>
```

The stack transform works with any mark that consumes y1 & y2 or x1 & x2, so you can stack rects, too.

```svelte live
<script lang="ts">
    import { getContext } from 'svelte';
    import { Plot, RectY } from '$lib';

    const getData = getContext('data');
    let { crimea } = $derived(getData());
</script>

<Plot grid color={{ legend: true }}>
    <RectY data={crimea} x="date" y="deaths" fill="cause" interval="month" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true }}>
    <RectY data={crimea} x="date" y="deaths" fill="cause" />
</Plot>
```

```svelte live
<script lang="ts">
    import { getContext } from 'svelte';
    import { Plot, Area, stackY } from '$lib';

    const getData = getContext('data');
    let { riaa } = $derived(getData());
</script>

<Plot grid title="Stack transform">
    <Area
        fill="group"
        {...stackY({
            data: riaa,
            x1: 'year',
            y: 'revenue',
            z: 'format'
        })}
    />
</Plot>
```
