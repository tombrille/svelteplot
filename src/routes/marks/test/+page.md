---
title: Test
---

This is a page with a single chart or easier debugging.

```svelte live
<script lang="ts">
    import { Plot, BarY, RuleY } from '$lib/fresh';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import { rollups } from 'd3-array';

    console.log({ RuleY })

    const { penguins } = getContext<Datasets>('data');

    let data = $derived(
        rollups(
            penguins,
            (d) => d.length,
            (d) => d.species,
            (d) => d.island
        )
            .map(([species, group]) => group.map(([island, count]) => ({ species, island, count })))
            .flat(1)
    );
</script>

<Plot grid>
    <BarY {data} x="island" y="count" fill="species" />
    <RuleY data={[0]} />  
</Plot>

```
