---
title: What is SveltePlot?
description: How to use SveltePlot
---

SveltePlot is a Svelte 5 framework for visualizing tabular data. SveltePlot is _heavily_ inspired by [Observable Plot](https://observablehq.com/plot/), but implemented as a set of reactive components (you can find out about the [differences here](/differences-to-plot))

You can use SveltePlot to create charts with a concise and minimal API. It abstracts away the rendering details using **marks** and allows for basic client-side data **transforms**.

:::info
The fastest way to learn SveltePlot is to familiarize yourself with [Observable Plot](https://observablehq.com/plot/)! SveltePlot is using a lot of the same concepts and marks.
:::

## Marks

Let's start with a very simple chart to explain the concepts. In the following example the `aapl` variable stores an array of objects that look like this:

```js
[{
  Date: new Date("2013-05-13"),
  Open: 64.50,
  High: 65.41,
  Low: 64.5,
  Close: 64.96,
  Volume: 79237200
}, { ... }]
```

If we want to plot a line showing the closing price over time, all we have to write is this:

```svelte
<Plot>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

...and we get this nice plot:

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);
</script>

<Plot>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

:::info
Noticed how SveltePlot added **axes automatically**? That's because it assumes that most plots will benefit from axes and it adds them implicitely. (You can disable this by passing `axes={false}` to the Plot component).
:::

Let's say we also want a horizontal rule at zero and a grid, so we extend our code from above a little bit: We activate the implicit grids by setting the grid flag and add a RuleY mark and passed zero as y channel.

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
    <RuleY y={0} />
</Plot>
```

```svelte live
<script>
    import { Plot, Line, RuleY } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
    <RuleY y={0} />
</Plot>
```

:::info
Noticed how SveltePlot automatically extended the range of the y axis? That's because the Plot component "collects" the data from all the marks to automatically compute the scale extents.
:::

There are a lot marks in SveltePlot and each comes with a lot of useful features! For instance, if we want to show a dot at the end of the line, we can use the built-in support for markers:

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Close" markerEnd="dot" />
    <RuleY y={0} />
</Plot>
```

```svelte live
<script>
    import { Plot, Line, RuleY } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line data={aapl} x="Date" y="Close" markerEnd="dot" />
    <RuleY y={0} />
</Plot>
```

## Transforms

Our dataset contains daily data, but what if we want to show weekly aggregates instead? Thanks to the **transforms** you don't have to leave

```svelte live
<script>
    import { Plot, Line, binX } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line
        {...binX(
            { data: aapl, x: 'Date', y: 'Close' },
            { interval: 'week', y: 'mean' }
        )}
        />
</Plot>
```

```svelte
<Plot grid>
    <Line
        {...binX(
            { data: aapl, x: 'Date', y: 'Close' },
            { interval: 'week', y: 'mean' }
        )} 
        marker="circle" />
</Plot>
```

We can also use the binX transform to compute the min and max closing value of each week and show it as an Area:

```svelte live
<script>
    import { Plot, Line, Area, binX } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line
        {...binX(
            { data: aapl, x: 'Date', y: 'Close' },
            { interval: 'week', y: 'mean' }
        )}
        />
    <Area
        fill="red" 
        {...binX(
            { data: aapl, x: 'Date', y1: 'Close', y2: 'Close'  },
            { interval: 'week', y1: 'min', y2: 'max' }
        )}
        />
</Plot>
```



## sdsd

The **Line** component we're using is called a **mark**, and it represents the geometric shape showing the line. The idea is that the marks can handle a lot of the complexities that you'd otherwise have to code each and every time.

Also, somehow, these axes already know the extent of our data! This is possible because all the marks let the Plot component know about the data!

```svelte
<Plot axes={false}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);
</script>

<Plot axes={false}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

Similarily you can enable the implicit grids by setting `grid` to `true`:

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

And somehow these axes already know the extent of the data we passed to the line mark!

```svelte --live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';

    let { olympians } = $derived($page.data.data);
</script>

<Plot
    testid="olympians"
    grid
    color={{ legend: true }}
    x={{ type: 'linear', insetLeft: 30, grid: true }}
    inset={10}>
    <Dot
        data={olympians}
        canvas
        x="weight"
        opacity="0.5"
        y="height"
        stroke="sex" />
</Plot>
```

```svelte
<Plot
    grid
    color={{ legend: true }}
    x={{ type: 'linear', insetLeft: 30, grid: true }}
    inset={10}>
    <Dot
        data={olympians}
        x="weight"
        y="height"
        opacity="0.5"
        stroke="sex"
        canvas />
</Plot>
```

This scatterplot suffers from overplotting: many dots are drawn in the same spot, so it’s hard to perceive density. We can fix this by applying a [bin transform](/transforms/bin) to group athletes of similar height and weight (and sex), and then use opacity to encode the number of athletes in the bin.

```svelte --live
<script>
    import { Plot, Rect, bin } from '$lib';
    import Mark from '$lib/Mark.svelte';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);

    let args = $derived(
        bin(
            {
                data: olympians,
                x: 'weight',
                y: 'height',
                fill: 'sex'
            },
            { fillOpacity: 'count' }
        )
    );
</script>

{#if olympians}
    <Plot testid="olympians-binned">
        <Rect {...args} inset={0} />
    </Plot>
{/if}
```

We can use the [binX transform](/transforms/bin) to compute a weight distribution.

```svelte --live
<script>
    import {
        Plot,
        Dot,
        RectY,
        GridY,
        AxisX,
        AxisY,
        RuleY,
        DotX,
        binX
    } from '$lib';
    import Mark from '$lib/Mark.svelte';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

{#if olympians}
    <Plot grid testid="olympians-hist">
        <RectY
            {...binX(
                {
                    data: olympians,
                    x: 'weight',
                    fill: 'sex'
                },
                { y: 'count' }
            )} />
        <RuleY data={[0]} />
    </Plot>
{/if}
```

```svelte
<Plot grid>
    <RectY
        {...binX(
            { data: olympians, x: 'weight', fill: 'sex' },
            { y: 'count' }
        )} />
    <RuleY data={[0]} />
</Plot>
```

Or we can use the built-in [faceting](/features/facets) to look at the distributions separately:

```svelte --live
<script>
    import {
        Plot,
        Dot,
        RectY,
        GridY,
        AxisX,
        AxisY,
        RuleY,
        DotX,
        binX
    } from '$lib';
    import Mark from '$lib/Mark.svelte';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

{#if olympians}
    <Plot grid testid="olympians-hist-facet">
        <RectY
            {...binX(
                {
                    data: olympians,
                    x: 'weight',
                    fill: 'sex',
                    fy: 'sex'
                },
                { y: 'count' }
            )} />
        <RuleY data={[0]} />
    </Plot>
{/if}
```

```svelte
<Plot>
    <RectY
        {...binX(
            {
                data: olympians,
                x: 'weight',
                fill: 'sex',
                fy: 'sex'
            },
            { y: 'count' }
        )} />
    <RuleY data={[0]} />
</Plot>
```

## What can SveltePlot do?

As of now, SveltePlot only implements a subset of Plots features.
