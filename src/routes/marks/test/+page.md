---
title: Test
---

This is a page with a single chart or easier debugging.

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
        stroke={(d) => /, MI /.test(d.division) ? 'red': '#ccc'}
    />
</Plot>
```
