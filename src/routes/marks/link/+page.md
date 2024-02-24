---
title: Link mark
---

For connecting two points with a line.


```svelte live
<script lang="ts">
    import { Plot, Link, Dot, Text } from '$lib/index.js';
    import { page } from '$app/stores';
    let { metros } = $derived($page.data.data);

    let hl = $state(false);
</script>

<Plot
    grid
    marginRight={20}
    inset={10}
    height={450}
    x={{ type: 'log', label: 'Population' }}
    y={{ label: 'Inequality' }}
    color={{
        scheme: 'BuRd',
        label: 'Change in inequality from 1980 to 2015',
        legend: true,
        tickFormat: '+f'
    }}
>
    <Link
        data={metros}
        x1="POP_1980"
        y1="R90_10_1980"
        x2="POP_2015"
        y2="R90_10_2015"
        bend
        markerEnd="arrow"
        style="transition: opacity 0.2s ease-in"
        opacity={{ scale: null, value: (d) => (!hl || hl === d ? 1 : 0.1) }}
        onmouseenter={(d) => (hl = d)}
        onmouseleave={(d) => (hl = null)}
        stroke={(d) => d.R90_10_2015 - d.R90_10_1980}
    />
    <Text
        data={metros}
        x="POP_2015"
        y="R90_10_2015"
        filter={(d) => (hl ? d === hl : d.highlight)}
        text="nyt_display"
        fill="currentColor"
        stroke="var(--svelteplot-bg)"
        strokeWidth={4}
        lineAnchor="bottom"
        dy={-6}
    />
</Plot>
```