---
title: Normalize transform
---

Useful for normalizing data series of varying magnitude such as stock prices of different companies.

```svelte live
<script>
    import { Plot, Line, normalizeY } from '$lib';
    import { Select } from '$lib/ui';
    import { page } from '$app/state';
    let { tech7 } = $derived(page.data.data);

    let basis = $state('first');
</script>

<Select
    bind:value={basis}
    label="Basis"
    options={[
        'first',
        'last',
        'min',
        'max',
        'mean',
        'median',
        'sum',
        'deviation',
        'extent'
    ]} />
<Plot y={{ grid: true }}>
    <Line
        {...normalizeY(
            {
                data: tech7,
                x: 'date',
                y: 'adj_close',
                stroke: 'symbol',
                curve: 'monotone-x'
            },
            basis
        )} />
</Plot>
```

```svelte
<Plot y={{ grid: true }}>
    <Line
        {...normalizeY(
            {
                data: tech7,
                x: 'date',
                y: 'adj_close',
                stroke: 'symbol'
            },
            'first'
        )} />
</Plot>
```

In addition to the named basis options you can define your own, e.g. to specify the exact date to index your data on:

```svelte live
<script>
    import { Plot, Line, normalizeY } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/state';
    let { tech7 } = $derived(page.data.data);

    let i = $state(30);
</script>

<Slider label="index" min={0} max={60} bind:value={i} />
<Plot y={{ grid: true }}>
    <Line
        {...normalizeY(
            {
                data: tech7,
                x: 'date',
                y: 'adj_close',
                stroke: 'symbol',
                curve: 'monotone-x'
            },
            (I, S) => S[i]
        )} />
</Plot>
```

```svelte
<Plot y={{ grid: true }}>
    <Line
        {...normalizeY(
            {
                data: tech7,
                x: 'date',
                y: 'adj_close',
                stroke: 'symbol',
                curve: 'monotone-x'
            },
            (I, S) => S[30]
        )} />
</Plot>
```

## NormalizeY

## NormalizeX
