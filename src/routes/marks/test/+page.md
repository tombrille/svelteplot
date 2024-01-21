---
title: Test
---

```svelte live
<script lang="ts">
    import { Plot, AreaY } from '$lib/index.js';

    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import { range } from 'd3-array';

    const { aapl } = getContext<Datasets>('data');
</script>

<Plot testid="area-y1">
    <AreaY data={aapl} x="Date" y="Close" />
</Plot>
```
