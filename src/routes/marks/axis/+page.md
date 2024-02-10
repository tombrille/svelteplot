---
title: Axis mark
---

By default SveltePlot will create axis marks automatically:

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { aapl } = $derived(getData());
</script>

<Plot grid testid="axis">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

You can turn the axes off individually by adding `axis: false` to the x and y scale options:

Or you can add the **AxisX** and **AxisY** marks explicitely for more options, such as
layering grids on top of other marks. Note that in this case, custom grid ticks are not synchronized
with the axes marks.

```svelte
<Plot frame x={{ domain: [0, 10] }} y={{ domain: [0, 5] }} marginBottom={40} marginRight={30}>
    <AxisX anchor="top" tickSize={10} tickFontSize="14px" />
    <AxisX stroke="cornflowerblue" fill="cornflowerblue" />
    <AxisY fill="green" anchor="right" tickSize={-5} tickPadding={10} />
    <AxisY stroke="magenta" fill="#dd0000" ticks={[0, 1.5, 2, 2.5, 4, 5]} />
</Plot>
```

The automatic ticks can be customized using the <b>tickSpacing</b> option:

```svelte
<Plot x={{ tickSpacing: 150 }} y={{ tickSpacing: 10 }} testid="tickspacing">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

You can turn off all axes

```svelte live
<script>
    import { Plot, Line, Dot } from '$lib';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { aapl } = $derived(getData());
</script>

<Plot x={{ axis: false }} y={{ axis: false }} height={200} margins={0} testid="axis-off">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot margins={0} x={{ axis: false }} y={{ axis: false }}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { aapl } = $derived(getData());
</script>

<p>
    This allows you to use a plot as tiny chart
    <Plot
        x={{ axis: false }}
        y={{ axis: false }}
        inset={3}
        maxWidth="50px"
        height={25}
        margins={0}
        testid="axis-off"
    >
        <Line data={aapl.slice(-60)} x="Date" y="Close" />
        <Dot data={aapl.slice(-1)} x="Date" y="Close" r={2} fill="currentColor" />
    </Plot>, inside a text paragraph or table -- often referred to as sparklines.
</p>

<style>
    p :global(figure) {
        display: inline-block;
        vertical-align: baseline;
    }
</style>
```
