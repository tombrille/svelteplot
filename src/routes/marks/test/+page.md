---
title: Test
---

This is a page with a single chart or easier debugging.

```svelte live
<script>
    import { Plot, Dot, Frame } from '$lib/index';
    import { getContext } from 'svelte';
    const { penguins } = getContext('data');
</script>

<Plot grid title="Facets" height={600} margins={0} testid="simple-bars">
    <Frame />
    <Dot data={penguins} 
        x="culmen_length_mm" 
        y="culmen_depth_mm" 
        stroke="species"
        fy="island" fx="sex" />
</Plot>
```
