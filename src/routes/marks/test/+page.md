---
title: Test
---

This is a page with a single chart or easier debugging.

```svelte live
<script lang="ts">
    import { Plot, Arrow, Dot, Text } from '$lib/index.js';
    import { csv } from 'd3-fetch';
    import { autoType } from 'd3-dsv';

    let metros = $state(false);

    $effect(async () => {
        metros = await csv('/data/metros.csv', autoType);
    });
</script>

{#if metros}
<Plot
    grid="true"
    marginRight={20}
    inset={10}
    x={{ type: 'log',
        label: 'Population', 
        base: 5,
    }}
    y={{ label: 'Inequality' }}
    color={{
        scheme: 'BuRd',
        label: 'Change in inequality from 1980 to 2015',
        legend: true,
        tickFormat: '+f'
    }}
>
    <Arrow
        data={metros}
        x1="POP_1980"
        y1="R90_10_1980"
        x2="POP_2015"
        y2="R90_10_2015"
        sort={{ channel: 'stroke' }}
        bend
        stroke={(d) => d.R90_10_2015 - d.R90_10_1980}
    />
    <Text
        data={metros}
        x="POP_2015"
        y="R90_10_2015"
        filter="highlight"
        text="nyt_display"
        fill="currentColor"
        stroke="var(--svelteplot-bg)"
        strokeWidth={4}
        lineAnchor="bottom"
        dy={-6}
    />
</Plot>
{:else}
loading...
{/if}
```