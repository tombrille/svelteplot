---
title: Facets
---

Facets are a way to split a plot into multiple panels

```svelte live
<script>
    import { Plot, Dot, AxisX } from '$lib/index';
    import { page } from '$app/stores';
    const { penguins } = $derived($page.data.data);
</script>

{#if penguins.length}
    <Plot
        frame
        grid
        height={600}
        inset={10}
        marginTop={35}
        marginBottom={40}>
        <Dot
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            r={2}
            opacity={0.1} />
        <Dot
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            fy="species"
            fx="sex" />
    </Plot>
{/if}
```

```svelte
<Plot frame grid height={600} inset={10} margins={30}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        r={2}
        opacity={0.1} />
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        fy="island"
        fx="sex" />
</Plot>
```
[Fork](https://svelte.dev/playground/fe8b6ab8f5ea4e06a6d733d1eae71f52?version=5.16.0)

Apply top-level facet options automatically:

```svelte --live
<script>
    import { Plot, Dot, Frame } from '$lib/index';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

{#if penguins.length}
    <Plot
        grid
        height={600}
        inset={10}
        margins={30}
        facet={{ data: penguins, x: 'sex', y: 'island' }}>
        <Frame />
        <Dot
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            facet="exclude"
            r={2}
            opacity={0.1} />
        <Dot
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            stroke="species" />
    </Plot>
{/if}
```
