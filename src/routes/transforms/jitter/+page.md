---
title: Jitter transform
---

The **jitter transform** adds random noise to data points, which is useful for revealing overlapping points in scatter plots and reducing overplotting. This is particularly helpful when working with discrete or categorical data where many points might share the same coordinates.

> **Note:** The jitter transform works in data coordinates. To jitter in screen coordinates, you can use the `dx` and `dy` mark properties instead.

The jitter transform spreads out overlapping points by adding random noise. This makes it easier to see the distribution and density of points:

```svelte live
<script>
    import { Plot, Dot, jitterY } from 'svelteplot';
    import { page } from '$app/state';
    import { Select, Slider } from '$lib/ui';
    let { cars } = $derived(page.data.data);

    let type = $state('uniform');
    let width = $state(0.35);
    let std = $state(0.15);
</script>

<Select
    bind:value={type}
    options={['uniform', 'normal']}
    label="Distribution type" />
{#if type === 'uniform'}
    <Slider
        bind:value={width}
        label="Width"
        min={0}
        max={1}
        step={0.01} />
{:else}
    <Slider
        bind:value={std}
        label="Standard deviation"
        min={0}
        max={1}
        step={0.01} />
{/if}
<Plot inset={20} y={{ ticks: [3, 4, 5, 6, 8], grid: true }}>
    <Dot
        {...jitterY(
            {
                data: cars,
                y: 'cylinders',
                x: 'weight (lb)'
            },
            {
                type,
                std,
                width
            }
        )}
        fill />
</Plot>
```

## Options

The jitter transform accepts the following options:

- **type**: Distribution type, either `'uniform'` (default) or `'normal'`
- **width**: Width of the uniform distribution (default: `0.35`); used when `type` is `'uniform'`
- **std**: Standard deviation for the normal distribution (default: `0.15`); used when `type` is `'normal'`

## jitterX

Jitters along the x dimensio

```svelte
<Dot
    {...jitterX(
        { data: cars, x: 'cylinders' },
        { type: 'normal' }
    )} />
```

## jitterY

Jitters along the y dimension

```svelte
<Dot
    {...jitterY(
        { data: cars, y: 'cylinders' },
        { type: 'normal' }
    )} />
```

## Jittering with dates

Jittering also works for temporal data. When jittering Date objects, random time offsets are added to each date value:

```svelte
<script>
    import { Plot, Dot, jitterX } from 'svelteplot';
    import { page } from '$app/state';
    import { Select, Slider } from '$lib/ui';
    let { aapl } = $derived(page.data.data);

    // Use a subset of the data for this example
    let data = $state(aapl.slice(0, 40));

    let type = $state('uniform');
    let width = $state(1000 * 60 * 60 * 24); // Default 1 day in milliseconds
    let std = $state(1000 * 60 * 60 * 12); // Default 12 hours in milliseconds
</script>

<Select
    bind:value={type}
    options={['uniform', 'normal']}
    label="Distribution type" />
{#if type === 'uniform'}
    <Slider
        bind:value={width}
        label="Width (milliseconds)"
        min={0}
        max={1000 * 60 * 60 * 48}
        step={1000 * 60 * 60} />
{:else}
    <Slider
        bind:value={std}
        label="Standard deviation"
        min={0}
        max={1000 * 60 * 60 * 24}
        step={1000 * 60 * 60} />
{/if}
<Plot inset={20} x={{ type: 'time' }} y={{ grid: true }}>
    <Dot
        {...jitterX(
            {
                data,
                x: 'Date',
                y: 'Volume'
            },
            {
                type,
                std,
                width
            }
        )} />
</Plot>
```

This example shows how jittering can be applied to date values in the x-axis, which can be useful when multiple events occur at the same date and would otherwise overlap.
