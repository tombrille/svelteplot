---
title: Bar mark
---

<script>
    import BarPlot from './BarPlot.svelte';
    import StackedBarPlot from './StackedBarPlot.svelte';
</script>

Bars are cool. They come in two flavors: [BarY](#BarY) for vertical bars (columns) and [BarX](#BarX) for horizontal bars.

## BarX

Here's a very simple bar chart:

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib';
</script>

<Plot
    y={{ type: 'band' }}
    x={{ grid: true }}
    height={200}
    marginTop={0}>
    <BarX data={[1, 2, 3, 4, 5]} />
    <RuleX data={[0]} />
</Plot>
```

```svelte
<Plot y={{ type: 'band' }} x={{ grid: true }} height={120}>
    <BarX data={[1, 2, 3, 4, 5]} />
    <RuleX data={[0]} />
</Plot>
```

You can create bullet bars using the `inset` option and two `BarX` layers:

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib';
</script>

<Plot y={{ type: 'band' }} height={200} marginTop={0}>
    <BarX data={[2.3, 4, 5, 3.7, 5.4]} opacity={0.3} />
    <BarX data={[1, 2, 3, 4, 5]} inset={8} />
</Plot>
```

## BarY

<BarPlot />

@code(./BarPlot.svelte)

In its simplest form, you can just pass a few numbers as data to create a bar chart:

```svelte live
<script>
    import { Plot, BarY, RuleY } from '$lib';
</script>

<Plot>
    <BarY data={[1, 2, 3, 4, 5]} />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot>
    <BarY data={[1, 2, 3, 4, 5]} />
    <RuleY data={[0]} />
</Plot>
```

You can create stacked bar charts by defining a fill channel which will be used for grouping the series by the implicit [stack transform](/transforms/stack):

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY, RuleX } from '$lib';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot
    x={{ axis: 'top' }}
    color={{ legend: true }}
    marginTop={40}>
    <RuleX data={[0]} />
    <BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} />
</Plot>
```

```svelte
<Plot
    x={{ axis: 'top' }}
    color={{ legend: true }}
    marginTop={40}>
    <RuleX data={[0]} />
    <BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} />
</Plot>
```

-   `x`
-   `y1`
-   `y2`

-   `y`
-   `x1`
-   `x2`

## Border radius

You can set a border radius for the bars either as number for all corners or as `{'{ topLeft, topRight, bottomRight, bottomLeft }'}` object to specify a border radius for individual corners:.

:::caution
Please be aware that by setting a border radius, you are slightly distorting the area of the bars.
:::

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib';
    import { Slider } from '$lib/ui';

    let radius = $state(10);
</script>

<Slider
    bind:value={radius}
    min={0}
    max={20}
    label="radius" />
<Plot x={{ axis: false }} y={{ type: 'band', axis: false }}>
    <BarX
        data={[1, 2, 3, 4, 5]}
        borderRadius={{
            topRight: radius,
            bottomRight: radius
        }} />
    <RuleX data={[0]} />
</Plot>
```

```svelte
<Plot x={{ axis: false }} y={{ type: 'band', axis: false }}>
    <BarX
        data={[1, 2, 3, 4, 5]}
        borderRadius={{ topRight: 10, bottomRight: 10 }} />
    <RuleX data={[0]} />
</Plot>
```
