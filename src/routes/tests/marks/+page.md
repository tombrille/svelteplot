---
title: Test
---

Link to [empty page](empty).

```svelte live
<script lang="ts">
    import { css } from '@emotion/css';
    import { Plot, Line, Dot, AreaY } from '$lib';
    import { Slider } from '$lib/ui';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
    let len = $state(80);
</script>

<Slider bind:value={len} min={10} max={200} />

<Plot grid height={400} {css}>
    <AreaY
        data={aapl.slice(-len)}
        opacity={0.2}
        y1="Open"
        x="Date"
        y2="Close" />
    <Dot
        data={aapl.slice(-len)}
        stroke={(d) => d.Close > 170}
        x="Date"
        y="Adj Close" />
</Plot>
```
