---
title: Arrow mark
---

Metro dataset:

```svelte live
<script lang="ts">
    import { Plot, Arrow, Dot, Text } from '$lib/index.js';
    import { page } from '$app/stores';
    let { metros } = $derived($page.data.data);

    let hl = $state(false);
    $inspect({ hl });
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
    }}>
    <Arrow
        data={metros}
        x1="POP_1980"
        y1="R90_10_1980"
        x2="POP_2015"
        y2="R90_10_2015"
        bend
        style="transition: opacity 0.2s ease-in"
        opacity={{
            scale: null,
            value: (d) =>
                !hl || hl.Metro === d.Metro ? 1 : 0.1
        }}
        onmouseenter={(evt, d) => (hl = d)}
        onmouseleave={() => (hl = null)}
        stroke={(d) => d.R90_10_2015 - d.R90_10_1980} />
    <Text
        data={metros}
        x="POP_2015"
        y="R90_10_2015"
        filter={(d) =>
            hl ? hl.Metro === d.Metro : d.highlight}
        text="nyt_display"
        fill="currentColor"
        stroke="var(--svelteplot-bg)"
        strokeWidth={4}
        lineAnchor="bottom"
        dy={-6} />
</Plot>
```

```svelte
<Plot
    marginRight={20}
    inset={10}
    height={450}
    x={{ type: 'log', label: 'Population' }}
    y={{ label: 'Inequality', type: 'point' }}
    color={{
        scheme: 'BuRd',
        label: 'Change in inequality from 1980 to 2015',
        legend: true,
        tickFormat: '+f'
    }}>
    <Arrow
        data={metros}
        x1="POP_1980"
        y1="R90_10_1980"
        x2="POP_2015"
        y2="R90_10_2015"
        bend
        style="transition: opacity 0.2s ease-in"
        opacity={{
            scale: null,
            value: (d) =>
                !hl || hl.Metro === d.Metro ? 1 : 0.1
        }}
        onmouseenter={(evt, d) => (hl = d)}
        onmouseleave={() => (hl = null)}
        stroke={(d) => d.R90_10_2015 - d.R90_10_1980} />
    <Text
        data={metros}
        x="POP_2015"
        y="R90_10_2015"
        filter={(d) =>
            hl ? hl.Metro === d.Metro : d.highlight}
        text="nyt_display"
        fill="currentColor"
        stroke="var(--svelteplot-bg)"
        strokeWidth={4}
        lineAnchor="bottom"
        dy={-6} />
</Plot>
```

Works as well with a point scale:

```svelte live
<script lang="ts">
    import {
        Plot,
        Arrow,
        Dot,
        Text,
        AxisY,
        GridY
    } from '$lib/index.js';
    import { page } from '$app/stores';
    let { metros } = $derived($page.data.data);
</script>

<Plot
    inset={10}
    x={{ label: 'Population' }}
    y={{ label: '' }}>
    <AxisY tickSize={0} />
    <GridY strokeDasharray="3,3" />
    <Arrow
        data={metros.slice(0, 50)}
        x1="R90_10_1980"
        x2="R90_10_2015"
        y="nyt_display" />
</Plot>
```

```svelte
<Plot
    inset={10}
    x={{ label: 'Population' }}
    y={{ label: '' }}>
    <AxisY tickSize={0} />
    <GridY strokeDasharray="3,3" />
    <Arrow
        data={metros.slice(0, 50)}
        x1="R90_10_1980"
        x2="R90_10_2015"
        y="nyt_display" />
</Plot>
```

Another thing you can use the arrow mark for is drawing network diagrams:

```svelte live
<script lang="ts">
    import {
        Plot,
        Arrow,
        Dot,
        Pointer,
        Text
    } from '$lib/index.js';
    import { json } from 'd3-fetch';
    import {
        forceSimulation,
        forceLink,
        forceManyBody,
        forceCenter
    } from 'd3-force';

    let links = $state([]);
    let nodes = $state([]);

    async function loadNetwork() {
        const graph = await json('/data/miserables.json');
        links = graph.links.map((d) => ({ ...d }));
        nodes = graph.nodes.map((d) => ({ ...d }));
        forceSimulation(nodes)
            .alphaTarget(0.3)
            .force(
                'link',
                forceLink(links).id((d) => d.id)
            )
            .force('charge', forceManyBody())
            .force('center', forceCenter());
    }

    $effect(async () => {
        if (!nodes.length) loadNetwork();
    });
</script>

<Plot
    x={{ axis: false }}
    y={{ axis: false }}
    inset={10}
    color={{ type: 'categorical' }}
    height={550}>
    <Arrow
        data={links}
        x1={(d) => d.source.x}
        y1={(d) => d.source.y}
        x2={(d) => d.target.x}
        y2={(d) => d.target.y}
        bend
        insetStart={(d) => d.source.id.length * 1}
        insetEnd={(d) => d.target.id.length * 1}
        opacity={0.2} />
    <Dot
        data={nodes}
        r={(d) => d.id.length}
        stroke="var(--svelteplot-bg)"
        fill="group"
        x="x"
        y="y" />
    <Pointer data={nodes} x="x" y="y" maxDistance={50}>
        {#snippet children({ data })}
            <Text
                {data}
                text="id"
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="x"
                y="y" />
        {/snippet}
    </Pointer>
</Plot>
```

```svelte
<script lang="ts">
    import { Plot, Arrow, Dot } from 'svelteplot';
    import { json } from 'd3-fetch';
    import {
        forceSimulation,
        forceLink,
        forceManyBody,
        forceCenter
    } from 'd3-force';

    let links = $state([]);
    let nodes = $state([]);

    async function loadNetwork() {
        const graph = await json('/data/miserables.json');
        links = graph.links.map((d) => ({ ...d }));
        nodes = graph.nodes.map((d) => ({ ...d }));
        forceSimulation(nodes)
            .alphaTarget(0.3)
            .force(
                'link',
                forceLink(links).id((d) => d.id)
            )
            .force('charge', forceManyBody())
            .force('center', forceCenter());
    }

    $effect(async () => {
        if (!nodes.length) loadNetwork();
    });
</script>

<Plot inset={10} color={{ type: 'categorical' }}>
    <Arrow
        data={links}
        x1={(d) => d.source.x}
        y1={(d) => d.source.y}
        x2={(d) => d.target.x}
        y2={(d) => d.target.y}
        bend
        insetStart={(d) => d.source.id.length * 1.1}
        insetEnd={(d) => d.target.id.length * 1.1}
        opacity="0.2" />
    <Dot
        data={nodes}
        r={(d) => d.id.length}
        stroke="var(--svelteplot-bg)"
        fill="group"
        x="x"
        y="y" />
</Plot>
```

## Arrow options

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

<Plot frame grid margin={20} inset={40}>
    {#snippet header()}
        <div style:margin-top="1em">
            <Slider label="inset" bind:value={inset} />
            <Slider
                label="headLength"
                bind:value={headLength} />
            <Slider
                label="headAngle"
                bind:value={headAngle} />
            <Slider
                label="bend"
                max="80"
                bind:value={bend} />
            <Select
                label="sweep: "
                options={[-1, 0, 1, '+x', '-x', '+y', '-y']}
                bind:value={sweep} />
        </div>
    {/snippet}
    <Dot {data} x="x1" y="y1" symbol="plus" opacity="0.4" />
    <Dot
        {data}
        x="x2"
        y="y2"
        symbol="circle"
        opacity="0.4" />
    <Arrow
        {data}
        {bend}
        {sweep}
        x1="x1"
        y1="y1"
        x2="x2"
        y2="y2"
        {inset}
        {headLength}
        {headAngle} />
</Plot>
```
