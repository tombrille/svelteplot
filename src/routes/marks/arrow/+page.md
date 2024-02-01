---
title: Arrow mark
---

Metro dataset:

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
    x={{ type: 'log', nice: false, label: 'Population', 
        domain: [150000, 21e6],
        tickFormat: '0a',
        ticks: [200e3, 2e6, 20e6] }}
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

Options:

-   **x1**, **y1**, **x2**, **y2** - coordinates of start and end points
-   **bend** - the bend angle, in degrees; defaults to 0°; _true_ for 22.5°
-   **insetEnd** - inset at the end of the arrow (useful if the arrow points to a dot)
-   **insetStart** - inset at the start of the arrow
-   **inset** - shorthand for the two insets
-   **headLength** - the arrowhead scale; defaults to 8
-   **headAngle** - the arrowhead angle, in degrees; defaults to 60°
-   **sweep** - controls the direction in which the arrow bends, possible options are _1_, _0_ (no bending), _-1_, _+x_, _-x_, _+y_, _-y_ (see demo below)

```svelte live
<script lang="ts">
    import { Plot, Arrow, Dot } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import Slider from '$lib/ui/Slider.svelte';
    import Select from '$lib/ui/Select.svelte';

    const data = [
        { x1: 1, y1: 1, x2: 6, y2: 3 },
        { x1: 3, y1: 2, x2: 1, y2: 6 },
        { x2: 3.5, y2: 2.5, x1: 1.5, y1: 6.5 }
    ];

    let bend = $state(22.5);
    let sweep = $state(1);
    let inset = $state(10);
    let headLength = $state(20);
    let headAngle = $state(40);
</script>

<Plot title="Arrow options" frame grid margin={20} inset={40}>
    {#snippet header()}
        <div style:margin-top="1em">
            <Slider label="inset" bind:value={inset} />
            <Slider label="headLength" bind:value={headLength} />
            <Slider label="headAngle" bind:value={headAngle} />
            <Slider label="bend" max="80" bind:value={bend} />
            <Select
                label="sweep: "
                options={[-1, 0, 1, '+x', '-x', '+y', '-y']}
                bind:value={sweep}
            />
        </div>
    {/snippet}
    <Dot {data} x="x1" y="y1" symbol="plus" opacity="0.4" />
    <Dot {data} x="x2" y="y2" symbol="circle" opacity="0.4" />
    <Arrow {data} {bend} {sweep} x1="x1" y1="y1" x2="x2" y2="y2" {inset} {headLength} {headAngle} />
</Plot>
```
