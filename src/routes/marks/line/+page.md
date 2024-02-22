---
title: Line mark
---

<script>
    import CurveDemo from './CurveDemo.svelte';
    import CO2Decades from './CO2Decades.svelte';
</script>

AAPL demo:

```svelte live
<script lang="ts">
    import { Plot, Line, RuleY } from '$lib';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
</Plot>
```

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
</Plot>
```

The following channels are supported:

-   **x** - bound to x scale
-   **y** - bound to y scale
-   **z**
-   **stroke** - bound to color scale
-   **sort**

BLS Demo:

```svelte live
<script lang="ts">
    import { Plot, Line, RuleY } from '$lib';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { bls } = $derived($page.data.data);
</script>

<Plot grid>
    <Line
        data={bls}
        x="date"
        y="unemployment"
        z="division"
        sort={(d) => /, MI /.test(d.division)}
        stroke={(d) => (/, MI /.test(d.division) ? 'red' : '#99999955')}
    />
</Plot>
```

```svelte
<Plot grid>
    <Line
        data={bls}
        x="date"
        y="unemployment"
        z="division"
        sort={(d) => /, MI /.test(d.division)}
        stroke={(d) => (/, MI /.test(d.division) ? 'red' : '#ccc')}
    />
</Plot>
```

CO2 decades:

<CO2Decades />

## LineX

Convenience wrapper

```svelte live
<script lang="ts">
    import { Plot, LineX } from '$lib';
    import { range } from 'd3-array';
</script>

<Plot grid x={{ nice: true }} maxWidth="180px">
    <LineX data={range(Math.PI * 100).map((i) => Math.sin(i / 20))} />
</Plot>
```

```svelte
<Plot grid x={{ nice: true }}>
    <LineX data={range(Math.PI * 100).map((i) => Math.sin(i / 20))} />
</Plot>
```

## LineY

Convenience wrapper for wrapping a list of numbers over their indices

```svelte live
<script lang="ts">
    import { Plot, LineY, AreaY } from '$lib';
    import { range } from 'd3-array';
</script>

<Plot grid y={{ nice: true }} height={150}>
    <LineY data={range(Math.PI * 100).map((i) => Math.sin(i / 10))} />
</Plot>
```

```svelte
<Plot grid y={{ nice: true }}>
    <LineY data={range(Math.PI * 100).map((i) => Math.sin(i / 50))} />
</Plot>
```

LineY can automatically group?

```svelte live
<script lang="ts">
    import { Plot, LineY } from '$lib';
    import { page } from '$app/stores';
    let { riaa } = $derived($page.data.data);
</script>

<Plot grid y={{ nice: true }} height={350}>
    <LineY data={riaa} x="year" y="revenue" z="format" stroke="group" />
</Plot>
```

## Interpolation

You can set the line interpolation using the **interpolation** option.

<CurveDemo />

## Markers

As you see in the previous plot, lines can show markers by setting the **marker** channel. The markers are automatically colored by stroke and scaled with the stroke-width of the lines. The following options are possible:

-   _dot_ - a filled circle without a stroke and 2.5px radius
-   _circle_ - a filled circle with a white stroke and 3px radius
-   _circle-stroke_ - a hollow circle with a colored stroke and a white fill and 3px radius
-   _arrow_ - an arrowhead with auto orientation
-   _arrow-reverse_ - an reversed arrowhead with auto orientation
-   _tick_ - a small perpendicular line
-   _tick-x_ - a small horizontal line
-   _tick-y_ - a small vertical line

You can specify the markers separately for the start of the line (**markerStart**), the end of the line (**markerEnd**) or the points in-between (**markerMid**) -- or you can set the **marker** option for all of them.

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import Select from '$lib/ui/Select.svelte';
    import Slider from '$lib/ui/Slider.svelte';

    let markerStart = $state('dot');
    let markerMid = $state('tick');
    let markerEnd = $state('circle-stroke');
    let strokeWidth = $state(1.5);

    const options = [
        'dot',
        'circle',
        'circle-stroke',
        'arrow',
        'arrow-reverse',
        'tick',
        'tick-x',
        'tick-y'
    ];

    import { page } from '$app/stores';
    let { crimea } = $derived($page.data.data);
</script>

<b>marker</b>
<Select label="start:" bind:value={markerStart} {options} />
<Select label="mid:" bind:value={markerMid} {options} />
<Select label="end:" bind:value={markerEnd} {options} /><br />
<Slider label="stroke width" bind:value={strokeWidth} min={0.5} max={4} step={0.1} />
<Plot inset={10} grid>
    <Line
        data={crimea}
        x="date"
        y="deaths"
        stroke="cause"
        {strokeWidth}
        {markerStart}
        {markerMid}
        {markerEnd}
    />
</Plot>
```

```svelte
<Plot>
    <Line
        data={crimea}
        x="date"
        y="deaths"
        stroke="cause"
        {strokeWidth}
        {markerStart}
        {markerMid}
        {markerEnd}
    />
</Plot>
```

Note that for the interpolation methods `basis`, `bundle`, and `step`, the marker symbols will not be placed at the location of the data points (shown as **+** below).

```svelte --live
<script lang="ts">
    import { Plot, LineY, Dot } from '$lib/index.js';
    import Slider from '$lib/ui/Slider.svelte';
    import Select from '$lib/ui/Select.svelte';
    import type { CurveName } from '$lib/types.js';

    // curve demo
    const numbers = [
        0.25, 0.09, 0.58, 0.22, 0.38, 0.03, 0.45, 0.12, 0.87, 0.99, 0.85, 0.5, 0.64, 0.86, 0.6,
        0.09, 0.14, 0.95, 0.92, 0.89
    ];
</script>

<Plot grid>
    <LineY data={numbers} curve="basis" marker="circle-stroke" />
    <!-- TODO: use DotY here -->
    <Dot data={numbers.map((d, i) => ({ value: d, index: i }))} symbol="plus" y="value" x="index" />
</Plot>
```

```svelte
<Plot grid>
    <LineY data={numbers} curve="basis" marker="circle-stroke" />
    <DotY data={numbers} symbol="plus" />
</Plot>
```

You can also specify a custom marker icon using the `marker` snippet:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid height={300}>
    <Line data={aapl.slice(-40)} x="Date" y="Adj Close">
        {#snippet marker(id, color)}
            <marker
                {id}
                fill="none"
                stroke={color}
                markerWidth="6"
                markerHeight="10"
                viewBox="-4 -10 8 10"
                orient="auto"
            >
                <path d="M0,-10L0,-2m-3,-3 l3,3l3,-3" />
            </marker>
        {/snippet}
    </Line>
</Plot>
```

```svelte
<Plot grid height={300}>
    <Line data={aapl.slice(-40)} x="Date" y="Adj Close">
        {#snippet marker(id, color)}
            <marker
                {id}
                fill="none"
                stroke={color}
                markerWidth="6"
                markerHeight="6"
                viewBox="-4 -8 8 8"
                orient="auto"
            >
                <path d="M0,-8L0,0M-3,-6 L0,0 L3,-6" />
            </marker>
        {/snippet}
    </Line>
</Plot>
```

And since the marker snippets contain regular Svelte code, you can do whatever you want with the markers, like animate them, for instance:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib';
    import { fly, fade } from 'svelte/transition';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);

    let shown = $state(false);

    $effect(() => {
        const t = setInterval(() => {
            shown = !shown;
        }, 1000);
        return () => clearInterval(t);
    });
</script>

<Plot grid height={300}>
    <Line data={aapl.slice(-40)} x="Date" y="Adj Close">
        {#snippet marker(id, color)}
            <marker
                {id}
                fill="none"
                stroke={color}
                markerWidth="6"
                markerHeight="10"
                viewBox="-4 -10 8 10"
                orient="auto"
            >
                {#if shown}
                    <path
                        in:fly={{ duration: 1000, y: -10 }}
                        out:fade
                        d="M0,-10L0,-2m-3,-3 l3,3l3,-3"
                    />
                {/if}
            </marker>
        {/snippet}
    </Line>
</Plot>
```

```svelte
<!-- <Plot><Line> -->
{#snippet marker(id, color)}
    <marker {id} fill="none" stroke={color} ... orient="auto">
        {#if shown}
            <path in:fly={{ duration: 1000, y: -10 }} out:fade d="M0,-10L0,-2m-3,-3 l3,3l3,-3" />
        {/if}
    </marker>
{/snippet}
<!-- </Line></Plot> -->
```

## More examples

The line mark can be used for a connection scatterplot:

```svelte --live
<script>
    import { Plot, Line, Dot, Text } from '$lib';

    import { page } from '$app/stores';
    let { driving } = $derived($page.data.data);
</script>

<Plot
    inset={10}
    grid
    x={{ label: 'Miles driven (per person-year) →' }}
    y={{ label: '↑ Cost of gasoline ($ per gallon)' }}
>
    <Line data={driving} x="miles" y="gas" curve="catmull-rom" marker />
    <Text data={driving} x="miles" y="gas" text="year" dy="-8" filter={(d) => d.year % 5 === 0} />
</Plot>
```

CO2 decades:

```svelte -live
<script>
    import { Plot, Line, Dot, Text } from '$lib';
    import { page } from '$app/stores';
    let { co2 } = $derived($page.data.data);
</script>

<Plot inset={10} grid>
    <Line data={co2} x="date" y="average" />
</Plot>
```
