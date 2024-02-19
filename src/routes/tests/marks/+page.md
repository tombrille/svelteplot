---
title: Test
---

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
                fill="var(--svelteplot-bg)"
                stroke={color}
                markerWidth="6"
                markerHeight="6"
                viewBox="-4 -8 8 8"
                orient="auto"
            >
                <path d="M-3,-6 L0,0 L3,-6h-6z" />
            </marker>
        {/snippet}
    </Line>
</Plot>
```
