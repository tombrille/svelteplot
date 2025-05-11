---
title: Brush mark
---

The **brush mark** is useful for interactively selecting data.

```svelte live
<script>
    import { Plot, Dot, Rect, Brush } from 'svelteplot';
    import { page } from '$app/state';

    const { penguins } = $derived(page.data.data);

    let brush = $state({ enabled: false });
</script>

<Plot
    grid
    color={{ legend: true }}
    x={{ label: '' }}
    y={{ label: '' }}
    title="Scatterplot">
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

You can use the BrushX mark to create an overview + detail time series:

```svelte live
<script>
    import {
        Plot,
        Frame,
        Line,
        RectX,
        BrushX
    } from 'svelteplot';
    import { page } from '$app/state';

    const { aapl } = $derived(page.data.data);

    let brush = $state({
        enabled: true,
        x1: new Date(2017, 0, 1),
        x2: new Date(2018, 0, 1)
    });

    const filteredData = $derived(
        brush.enabled
            ? aapl.filter(
                  (d) =>
                      d.Date >= brush.x1 &&
                      d.Date <= brush.x2
              )
            : aapl
    );
</script>

<!-- detail plot -->
<Plot
    y={{ insetTop: 10, insetBottom: 10 }}
    grid
    marginBottom={30}>
    <Line data={filteredData} x="Date" y="Close" />
</Plot>
<!-- overview plot -->
<Plot
    height={90}
    x={{ label: '', grid: true }}
    y={{ axis: false, label: '' }}>
    <Frame opacity={0.4} />
    <Line data={aapl} x="Date" y="Close" opacity={0.3} />
    {#if brush.enabled}
        <RectX
            data={[brush]}
            x1="x1"
            x2="x2"
            fill="var(--svp-blue)"
            opacity={0.2} />
        <Line data={filteredData} x="Date" y="Close" />
    {/if}
    <BrushX bind:brush stroke={false} />
</Plot>
```

You can also use the Brush mark to create a zoomable plot:

```svelte live
<script>
    import { Plot, Dot, Rect, Brush } from 'svelteplot';
    import { Tween } from 'svelte/motion';
    import { cubicInOut } from 'svelte/easing';
    import { page } from '$app/state';
    import { extent } from 'd3-array';

    const { penguins } = $derived(page.data.data);

    let brush = $state({
        x1: 40,
        x2: 45,
        y1: 15,
        y2: 20,
        enabled: false
    });
    let isZoomedIn = $state(false);

    const fullDomainX = extent(
        penguins,
        (d) => d.culmen_length_mm
    );
    const fullDomainY = extent(
        penguins,
        (d) => d.culmen_depth_mm
    );

    let domainX = $state(fullDomainX);
    let domainY = $state(fullDomainY);

    function resetZoom() {
        domainX = fullDomainX;
        domainY = fullDomainY;
        isZoomedIn = false;
    }

    const domainXT = Tween.of(() => domainX, {
        easing: cubicInOut
    });
    const domainYT = Tween.of(() => domainY, {
        easing: cubicInOut
    });
</script>

<Plot
    grid
    x={{
        domain: domainXT.current,
        label: 'culmen_length_mm'
    }}
    y={{
        domain: domainYT.current,
        label: 'culmen_depth_mm'
    }}
    title="Zoomable scatterplot">
    {#snippet header()}
        {#if isZoomedIn}
            <button onclick={resetZoom}>reset zoom</button>
        {/if}
    {/snippet}
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species" />
    <Brush
        bind:brush
        cursor="zoom-in"
        onbrushend={(e) => {
            if (e.brush.enabled) {
                domainX = [e.brush.x1, e.brush.x2];
                domainY = [e.brush.y1, e.brush.y2];
                brush.enabled = false;
                isZoomedIn = true;
            }
        }} />
</Plot>

<style>
    button {
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px;
    }
    :global(.plot-header) {
        position: relative;
    }
</style>
```
