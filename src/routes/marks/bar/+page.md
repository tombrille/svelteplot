---
title: Bar mark
---

<script>
    import BarPlot from './BarPlot.svelte';
    import StackedBarPlot from './StackedBarPlot.svelte';
</script>

Bars are cool. They come in two flavors: [BarY](#BarY) for vertical bars (columns) and [BarX](#BarX) for horizontal bars.

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

You can create stacked bar charts by defining a fill channel which will be used for grouping the series by the implicit [stack transform](/transforms/stack):

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY, RuleX } from '$lib';
    import { getContext } from 'svelte';

    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
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
    color={{ legend: true }}>
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
[fork](https://svelte.dev/playground/6d334e103f9e444d99bb67c8af1335bc?version=5.28.2)



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

```svelte
<Plot y={{ type: 'band' }} height={200} marginTop={0}>
    <BarX data={[2.3, 4, 5, 3.7, 5.4]} opacity={0.3} />
    <BarX data={[1, 2, 3, 4, 5]} inset={8} />
</Plot>
```

[fork](https://svelte.dev/playground/d8170543f02c482ba64e82787d716e40?version=5.28.2)

Note that **inset** by default only applies along the band scale, but won't affect the width of a BarX or and height of a BarY. You can use insetLeft, insetRight, insetTop, and insetBottom directly, e.g. to add space in a stacked bar chart:

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY, RuleX } from '$lib';
    import { getContext } from 'svelte';

    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
</script>

<Plot
    x={{ axis: 'top' }}>
    <RuleX data={[0]} />
    <BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} 
        insetRight={1} />
</Plot>
```

```svelte
<BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} 
        insetRight={1} />
```

[fork](https://svelte.dev/playground/6f5f4ae882e24f5b81c60842c6250f31?version=5.28.2)


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

## BarX

Required channels:

- y (band scale) 
- x1, x2

## BarY