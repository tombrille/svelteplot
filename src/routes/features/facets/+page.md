---
title: Facets
---

```svelte live
<script>
    import { Plot, Dot, Frame } from '$lib/index';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { penguins } = $derived(getData());
</script>

{#if penguins.length}
    <Plot grid title="Facets" height={600} inset={10} margins={30} testid="simple-bars">
        <Frame />
        <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" r={2} opacity={0.1} />
        <Dot
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            stroke="species"
            fy="island"
            fx="sex"
        />
    </Plot>
{/if}
```

Apply top-level facet options automatically:

```svelte live
<script>
    import { Plot, Dot, Frame } from '$lib/index';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { penguins } = $derived(getData());
</script>

{#if penguins.length}
    <Plot
        grid
        height={600}
        inset={10}
        margins={30}
        facet={{ data: penguins, x: 'sex', y: 'island' }}
    >
        <Frame />
        <Dot
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            facet="exclude"
            r={2}
            opacity={0.1}
        />
        <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
    </Plot>
{/if}
```
