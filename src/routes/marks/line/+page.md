---
title: Line mark
---

AAPL demo:

```svelte live
<script lang="ts">
    import { Plot, Line, RuleY } from '$lib';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
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
    import { getContext } from 'svelte';

    const { bls } = getContext<Datasets>('data');
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

## More examples

Line with symbols:

```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
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
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
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
