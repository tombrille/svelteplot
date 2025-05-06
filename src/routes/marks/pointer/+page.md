---
title: Pointer mark
---

Pointer is a mark that doesn't render anything by itself, but you can use it to show marks filtered to data points close to the cursor. You access the filtered data by placing the marks as children of the Pointer mark:

```svelte live
<script>
    import { Plot, Line, Dot, Text, Pointer } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);

    let sel = $state([]);
</script>

<Plot>
    <Line data={aapl} x="Date" y="Close" />
    <Pointer
        data={aapl}
        x="Date"
        y="Close"
        maxDistance={30}>
        {#snippet children({ data })}
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy={-5} />
            <Dot {data} x="Date" y="Close" fill />
        {/snippet}
    </Pointer>
</Plot>
```

```svelte
<Plot>
    <Line data={aapl} x="Date" y="Close" />
    <Pointer data={aapl} x="Date">
        {#snippet children({ data })}
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy={-5} />
            <Dot {data} x="Date" y="Close" fill />
        {/snippet}
    </Pointer>
</Plot>
```

[fork](https://svelte.dev/playground/a1220e8cb4d74338a3b7468466113df2?version=5.28.1)

You can create a "crosshair" mark by wrapping grids and axes marks inside a pointer mark:

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleX,
        RuleY,
        AxisX,
        AxisY,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<div style="touch-action: none">
    <Plot marginBottom={30}>
        <AxisX />
        <AxisY />
        <Line data={aapl} x="Date" y="Close" />
        <Pointer
            data={aapl}
            x="Date"
            y="Close"
            maxDistance={30}>
            {#snippet children({ data })}
                {#if data.length > 0}
                    <RuleX {data} x="Date" opacity="0.3" />
                    <RuleY {data} y="Close" opacity="0.3" />
                    <AxisX
                        data={data.map((d) => d.Date)}
                        tickFormat="MMM D, YYYY" />
                    <AxisY
                        data={data.map((d) => d.Close)}
                        tickFormat={(d) => d.toFixed()} />
                {/if}
            {/snippet}
        </Pointer>
    </Plot>
</div>
```

```svelte
<Plot>
    <AxisX />
    <AxisY />
    <Line data={aapl} x="Date" y="Close" />
    <Pointer
        data={aapl}
        x="Date"
        y="Close"
        maxDistance={30}>
        {#snippet children({ data })}
            <RuleX {data} x="Date" opacity="0.3" />
            <RuleY {data} y="Close" opacity="0.3" />
            <AxisX
                data={data.map((d) => d.Date)}
                tickFormat={(d) => d.getFullYear()} />
            <AxisY
                data={data.map((d) => d.Close)}
                tickFormat={(d) => d.toFixed()} />
        {/snippet}
    </Pointer>
</Plot>
```

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleY,
        Dot,
        Text,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot testid="aapl-line-frame" marginRight={20}>
    <Line data={aapl} x="Date" y="Close" />
    <Pointer data={aapl} y="Close" maxDistance={30}>
        {#snippet children({ data })}
            <RuleY {data} y="Close" opacity={0.2} />
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-10" />
            <Dot {data} x="Date" y="Close" fill />
        {/snippet}
    </Pointer>
</Plot>
```

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleX,
        Dot,
        Text,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot testid="aapl-line-frame" marginRight={20}>
    <Line data={aapl} x="Date" y="Close" />
    <Pointer data={aapl} x="Date" maxDistance={30}>
        {#snippet children({ data })}
            <RuleX {data} x="Date" opacity={0.2} />
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-10" />
            <Dot {data} x="Date" y="Close" fill />
        {/snippet}
    </Pointer>
</Plot>
```

If you pass a **z** channel to the Pointer mark it will try to find up to one data row per group:

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleX,
        Dot,
        Text,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { stocks } = $derived(page.data.data);
    let stocks2 = $derived(
        stocks.filter((d) => d.Date < new Date(2018, 0, 1))
    );
</script>

<Plot
    testid="stocks-line-frame"
    y={{ type: 'log' }}
    marginRight={20}>
    <Line
        data={stocks2}
        x="Date"
        y="Close"
        stroke="Symbol" />
    <Pointer
        data={stocks2}
        x="Date"
        z="Symbol"
        maxDistance={30}>
        {#snippet children({ data })}
            <Text
                {data}
                fill="Symbol"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-7" />
            <Dot
                {data}
                x="Date"
                y="Close"
                fill="Symbol"
                strokeWidth="0.7"
                stroke="var(--svelteplot-bg)" />
        {/snippet}
    </Pointer>
</Plot>
```

```svelte
<Plot
    testid="stocks-line-frame"
    y={{ type: 'log' }}
    marginRight={20}>
    <Line
        data={stocks}
        x="Date"
        y="Close"
        stroke="Symbol" />
    <Pointer
        data={stocks}
        x="Date"
        z="Symbol"
        maxDistance={30}>
        {#snippet children({ data })}
            <Text
                {data}
                fill="Symbol"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-7" />
            <Dot
                {data}
                x="Date"
                y="Close"
                fill="Symbol"
                stroke="var(--svelteplot-bg)" />
        {/snippet}
    </Pointer>
</Plot>
```

## Synchronized tooltips

You can pass an `onupdate` event handler to synchronize the tooltips between two plots

TODO: Example
