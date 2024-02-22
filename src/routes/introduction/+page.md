---
title: What is SveltePlot?
description: How to use SveltePlot
lastUpdate: 2024-01-10
---

:::caution
SveltePlot is still in a very, very early alpha stage, so early that it's **not recommended** to use it, yet. Also, it's built using Svelte 5, which itself is not released, yet.
:::

SveltePlot is a free, open-source Svelte framework for visualizing tabular data, focused on accelerating exploratory data analysis. SveltePlot is _heavily_ inspired by [Observable Plot](https://observablehq.com/plot/), but implemented as Svelte 5 components (you can find out about the [differences here](/differences-to-plot))

You can use SveltePlot to create charts with a concise and minimal API.

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';

    let { olympians } = $derived($page.data.data);

    let showPlot = $state(false);
    $effect(() => {
        showPlot = true;
    });
</script>

{#if showPlot}
    <Plot
        testid="olympians"
        grid
        color={{ legend: true }}
        x={{ type: 'linear', insetLeft: 30, grid: true }}
        inset={10}
    >
        <Dot data={olympians} x="weight" opacity="0.5" y="height" stroke="sex" />
    </Plot>
{/if}
```

```svelte
<Plot grid color={{ legend: true }} x={{ type: 'linear', insetLeft: 30, grid: true }} inset={10}>
    <Dot data={olympians} x="weight" opacity="0.5" y="height" stroke="sex" />
</Plot>
```

This scatterplot suffers from overplotting: many dots are drawn in the same spot, so it’s hard to perceive density. We can fix this by applying a [bin transform](/transforms/bin) to group athletes of similar height and weight (and sex), and then use opacity to encode the number of athletes in the bin.

```svelte live
<script>
    import { Plot, Rect, bin } from '$lib';
    import Mark from '$lib/Mark.svelte';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);

    let args = $derived(
        bin({ data: olympians, x: 'weight', y: 'height', fill: 'sex' }, { fillOpacity: 'count' })
    );
</script>

{#if olympians}
    <Plot testid="olympians-binned">
        <Rect {...args} inset={0} />
    </Plot>
{/if}
```

We can use the [binX transform](/transforms/bin) to compute a weight distribution.

```svelte live
<script>
    import { Plot, Dot, RectY, GridY, AxisX, AxisY, RuleY, DotX, binX } from '$lib';
    import Mark from '$lib/Mark.svelte';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

{#if olympians}
    <Plot grid testid="olympians-hist">
        <RectY {...binX({ data: olympians, x: 'weight', fill: 'sex' }, { y: 'count' })} />
        <RuleY data={[0]} />
    </Plot>
{/if}
```

```svelte
<Plot grid>
    <RectY {...binX({ data: olympians, x: 'weight', fill: 'sex' }, { y: 'count' })} />
    <RuleY data={[0]} />
</Plot>
```

Or we can use the built-in [faceting](/features/facets) to look at the distributions separately:

```svelte live
<script>
    import { Plot, Dot, RectY, GridY, AxisX, AxisY, RuleY, DotX, binX } from '$lib';
    import Mark from '$lib/Mark.svelte';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

{#if olympians}
    <Plot grid testid="olympians-hist-facet">
        <RectY
            {...binX({ data: olympians, x: 'weight', fill: 'sex', fy: 'sex' }, { y: 'count' })}
        />
        <RuleY data={[0]} />
    </Plot>
{/if}
```

```svelte
<Plot>
    <RectY
        {...binX(
            {
                data: olympians,
                x: 'weight',
                fill: 'sex',
                fy: 'sex'
            },
            { y: 'count' }
        )}
    />
    <RuleY data={[0]} />
</Plot>
```

## What can SveltePlot do?

As of now, SveltePlot only implements a subset of Plots features.
