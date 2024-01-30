---
title: Line mark
---

AAPL demo:

```svelte live
<script lang="ts">
    import { Plot, Line, RuleY } from '$lib/fresh';
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
    import { Plot, Line, RuleY } from '$lib/fresh';
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

## LineY

## More examples

Line with symbols:

```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib/fresh';
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
    import { Plot, Line, Dot } from '$lib/fresh';
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
