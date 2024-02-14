---
title: Line mark
---

<script>
    import CurveDemo from './CurveDemo.svelte';
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

## More examples

Line with symbols:

```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot height={200} grid>
    <Line data={aapl.slice(-100)} x="Date" y="Adj Close" />
    <Dot data={aapl.slice(-100)} x="Date" y="Adj Close" fill="currentColor" />
</Plot>
```

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <Dot data={aapl} x="Date" y="Adj Close" fill="currentColor" />
</Plot>
```

symbol on last point only:

```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <Dot data={aapl.slice(-1)} x="Date" y="Adj Close" r={3} fill="currentColor" />
</Plot>
```

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <!-- assumes data is sorted -->
    <Dot data={aapl.slice(-1)} x="Date" y="Adj Close" r={3} fill="currentColor" />
</Plot>
```

Here you can play around with the curve and tension parameters:

<CurveDemo />

The line mark can be used for a connection scatterplot:

```svelte live
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

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import Select from '$lib/ui/Select.svelte';
    import Slider from '$lib/ui/Slider.svelte';

    let marker = $state('circle');
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

<Select label="marker" bind:value={marker} {options} />
<Slider label="stroke width" bind:value={strokeWidth} min={0.5} max={4} step={0.1} />
<Plot inset={10} frame grid marginBottom={50}>
    <Line data={crimea} x="date" fx="cause" y="deaths" stroke="cause" {strokeWidth} {marker} />
</Plot>
```

```svelte
<Plot>
    <Line data={crimea} x="date" y="deaths" stroke="cause" {strokeWidth} {marker} />
</Plot>
```
