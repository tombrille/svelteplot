---
title: Cell mark
---

```svelte live
<script>
    import { Plot, Cell, formatMonth } from '$lib';

    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

{#if seattle}
    <Plot
        padding={0}
        aspectRatio={1}
        y={{
            ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            tickFormat: formatMonth('en', 'short')
        }}
        testid="seattle-temp"
        let:plot
    >
        <Cell
            data={seattle}
            filter={(d) => d.date.getUTCFullYear() === 2015}
            x={(d) => d.date.getUTCDate()}
            y={(d) => d.date.getUTCMonth()}
            fill="temp_max"
            inset="0.5"
        />
    </Plot>
{/if}
```
