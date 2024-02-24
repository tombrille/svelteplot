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


As you see in the previous plot, lines can show [markers](/features/markers) by setting the **marker** channel. 

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

<CO2Decades />

```svelte
<Plot inset={10} grid>
    <Line data={co2} x="date" y="average" />
</Plot>
```
