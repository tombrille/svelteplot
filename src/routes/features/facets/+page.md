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

Here's a histogram of Olympian athlete weights faceted by sex:

```svelte live
<script>
    import { Plot, RectY, RuleY, binX } from '$lib';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

<Plot grid height={300}>
    <RectY
        {...binX(
            { data: olympians, x: 'weight', fy: 'sex' },
            { y: 'count' }
        )} />
    <RuleY y="0" />
</Plot>
```

```svelte
<Plot grid>
    <RectY
        {...binX(
            { data: olympians, x: 'weight', fy: 'sex' },
            { y: 'count' }
        )} />
    <RuleY y={0} />
</Plot>
```

[Fork](https://svelte.dev/playground/f01016597a854ec3ad4b38f901a513ec?version=5.16.0)

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
