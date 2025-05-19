---
title: Gradients
---

While SveltePlot allows you to use any SVG gradients, you can also make use of the [LinearGradientX](#LinearGradientX) and [LinearGradientY](#LinearGradientY) helpers, which allow mapping data to gradient stops.

## LinearGradientX

For horizontal gradients (= from left to right)

**Options:**

- **id** - the gradient id to be used in `url(#...)` fills and strokes
- **stops** - a list of `({ x, color })` pairs, with x coordinates defined in data space

```svelte live
<script lang="ts">
    import {
        Plot,
        Line,
        RuleY,
        LinearGradientX
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot height={250} x={{ grid: true }}>
    <defs>
        <LinearGradientX
            id="gradientx"
            stops={[
                {
                    x: new Date(2014, 0, 1),
                    color: 'cyan'
                },
                {
                    x: new Date(2016, 0, 1),
                    color: 'magenta'
                },

                {
                    x: new Date(2018, 0, 1),
                    color: 'gold'
                }
            ]} />
    </defs>
    <Line
        data={aapl}
        x="Date"
        y="Close"
        stroke="url(#gradientx)" />
</Plot>
```

```svelte
<Plot height={250} x={{ grid: true }}>
    <defs>
        <LinearGradientX
            id="gradientx"
            stops={[
                {
                    x: new Date(2014, 0, 1),
                    color: 'cyan'
                },
                {
                    x: new Date(2016, 0, 1),
                    color: 'magenta'
                },

                {
                    x: new Date(2018, 0, 1),
                    color: 'gold'
                }
            ]} />
    </defs>
    <Line
        data={aapl}
        x="Date"
        y="Close"
        stroke="url(#gradientx)" />
</Plot>
```

## LinearGradientY

For vertical gradients (from top to bottom)

**Options:**

- **id** - the gradient id to be used in `url(#...)` fills and strokes
- **stops** - a list of `({ y, color })` pairs, y coordinates defined in data space

```svelte live
<script lang="ts">
    import {
        Plot,
        Line,
        Frame,
        LinearGradientX,
        LinearGradientY
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot y={{ grid: true }}>
    <defs>
        <LinearGradientY
            id="gradient-y"
            stops={[
                { y: 180, color: 'cyan' },
                { y: 140, color: 'magenta' },
                { y: 100, color: 'magenta' },
                { y: 80, color: 'gold' },
                { y: 60, color: 'gold' }
            ]} />
    </defs>
    <Line
        data={aapl}
        x="Date"
        y="Close"
        stroke="url(#gradient-y)" />
    <Frame fill="url(#gradient-y)" opacity={0.1} />
</Plot>
```

```svelte
<Plot>
    <defs>
        <LinearGradientY
            id="gradient-y"
            stops={[
                { y: 180, color: 'cyan' },
                { y: 140, color: 'magenta' },
                { y: 100, color: 'magenta' },
                { y: 80, color: 'gold' },
                { y: 60, color: 'gold' }
            ]} />
    </defs>
    <Line
        data={aapl}
        x="Date"
        y="Close"
        stroke="url(#gradient-y)" />
    <Frame fill="url(#gradient-y)" opacity={0.1} />
</Plot>
```
