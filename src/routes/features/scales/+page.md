---
title: Scales
---

A core feature of SveltePlot are automatically inferred scales.

## Continuous scales

The domain of a quantitative scale is a continuous extent [min, max] where min and max are
numbers, such as temperatures. Below, the first domain value (x = 0) corresponds to the left
side of the plot while the second (x = 100) corresponds to the right side.

```svelte live
<script lang="ts">
    import { Plot, GridX, GridY, Line } from '$lib/index.js';
</script>

<Plot
    x={{ domain: [0, 100], grid: true }}
    marginTop={0}
    marginLeft={10}
    marginRight={10}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [0, 100], grid: true }} />
```

Scales can be reversed using the **reverse** option:

```svelte live
<script lang="ts">
    import { Plot, GridX, GridY, Line } from '$lib/index.js';
</script>

<Plot
    x={{ domain: [0, 100], grid: true, reverse: true }}
    marginTop={0}
    marginLeft={10}
    marginRight={10}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [0, 100], grid: true, reverse: true }} />
```

If the domain is dates, SveltePlot will default to a UTC scale. This is a linear scale with ticks
based on the Gregorian calendar.

```svelte live
<script lang="ts">
    import { Plot, GridX, GridY, Line } from '$lib/index.js';
</script>

<Plot
    x={{ 
        type: 'time',
        domain: [
            new Date('2021-01-01'), 
            new Date('2022-01-01')
        ], grid: true }}
    marginTop={0}
    marginLeft={20}
    marginRight={20}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [new Date('2021-01-01'), new Date('2022-01-01')], grid: true }} />
```

## Logarithmic scales

SveltePlot will automatically detect a scale type, but you can also set it explicitly using the **type** scale option:

```svelte live
<script lang="ts">
    import { Plot, GridX, GridY, Line } from '$lib/index.js';
</script>

<Plot
    x={{ domain: [1, 1000], type: 'log', grid: true }}
    marginTop={0}
    marginLeft={10}
    marginRight={20}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [1, 1000], type: 'log', grid: true }} />
```

By default, SveltePlot will create axis marks automatically:

```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');

    let nearestDataPoint = $state<Datasets['aapl'][0] | null>(aapl.at(-1));
</script>

<Plot grid height={250} testid="axis-off">
    <Line data={aapl} x="Date" y="Close" />
    {#if nearestDataPoint}
        <Dot fill="black" r={4} data={[nearestDataPoint]} x="Date" y="Close" />
    {/if}
</Plot>
```

But you can turn them off:

```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');

    let nearestDataPoint = $state<Datasets['aapl'][0] | null>(aapl.at(-1));
</script>

<Plot grid height={250} y={{ axis: false }} marginLeft={0} testid="axis-off">
    <Line data={aapl} x="Date" y="Close" />
    {#if nearestDataPoint}
        <Dot fill="black" r={4} data={[nearestDataPoint]} x="Date" y="Close" />
    {/if}
</Plot>
```
