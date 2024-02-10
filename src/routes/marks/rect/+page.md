---
title: Rect mark
---

The interval transform may be used to convert a single value in x or y (or both) into an extent. For example, the chart below shows the observed daily maximum temperature in Seattle for the year 2015. The day-in-month and month-in-year numbers are expanded to unit intervals by setting the [interval option](/transforms/interval) to 1.

```svelte live
<script>
    import { Plot, Rect } from '$lib';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { seattle } = $derived(getData());
</script>

{#if seattle}
    <Plot
        aspectRatio={1}
        y={{ ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }}
        testid="seattle-temp"
    >
        <Rect
            data={seattle}
            filter={(d) => d.date.getUTCFullYear() === 2015}
            x={(d) => d.date.getUTCDate()}
            y={(d) => d.date.getUTCMonth()}
            interval={1}
            fill="temp_max"
            inset="0.5"
        />
    </Plot>
{/if}
```
