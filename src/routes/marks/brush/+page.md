---
title: Brush mark
---

The **brush mark** is useful for interactively selecting data.

```svelte live
<script>
    import { Plot, Dot, Rect, Brush } from 'svelteplot';
    import { page } from '$app/state';

    const { penguins } = $derived(page.data.data);

    let brush = $state({
        x1: 40,
        x2: 45,
        y1: 15,
        y2: 20,
        enabled: true
    });
</script>

<Plot
    grid
    color={{ legend: true }}
    x={{ label: '' }}
    y={{ label: '' }}
    title="Scatterplot {brush.enabled}">
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        opacity={brush.enabled ? 0.3 : 1}
        stroke={(d) =>
            brush.enabled ? 'lightgray' : d.species}
        symbol="species" />
    {#if brush.enabled}
        <Rect
            data={[brush]}
            x1="x1"
            x2="x2"
            y1="y1"
            y2="y2"
            opacity={0.1} />
        <Dot
            data={penguins}
            filter={(d) =>
                d.culmen_length_mm >= brush.x1 &&
                d.culmen_length_mm <= brush.x2 &&
                d.culmen_depth_mm >= brush.y1 &&
                d.culmen_depth_mm <= brush.y2}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            stroke="species"
            symbol="species" />
    {/if}
    <Brush bind:brush />
</Plot>
```
