---
title: Axis mark
---

Axis marks are useful for rendering the x and y axes! SveltePlot will add them automatically.

## Implicit axes

By default SveltePlot will create axis marks automatically:

```svelte live
<script>
    import { Plot, Line } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot testid="axis">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

You can turn the implicit axes off by adding `axis: false`

```svelte live
<script>
    import { Plot, Line } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot axes={false}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot axes={false}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```


```svelte live
<script lang="ts">
    import { Plot, Line, Dot } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<p>
    This allows you to use a plot as tiny chart
    <Plot
        axes={false}
        inset={3}
        maxWidth="50px"
        height={25}
        margins={0}
        testid="axis-off">
        <Line data={aapl.slice(-60)} x="Date" y="Close" />
    </Plot>, inside a text paragraph or table -- often
    referred to as sparklines.
</p>

<style>
    p :global(figure) {
        display: inline-block;
        vertical-align: baseline;
    }
</style>
```

You can also control the implicit axes using the x and y options:

```svelte live
<script>
    import { Plot, Line } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot x={{ axis: 'both' }} y={{ axis: false }}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot x={{ axis: 'both' }} y={{ axis: false }}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

Axis options:

- **axis**
- **tickSpacing**
- **tickFormat**

## Explicit axes

If you add the `AxisX` and `AxisY` marks to your plot, SveltePlot will disable the implicit axes! Also you can use a lot more options to customize and style the axes.

```svelte live
<script>
    import { Plot, Line, AxisX, AxisY } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot>
    <AxisX tickFontSize={15} />
    <AxisY fill="red" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot>
    <AxisX tickFontSize={15} />
    <AxisY fill="red" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```


```svelte
<Plot
    frame
    x={{ domain: [0, 10] }}
    y={{ domain: [0, 5] }}
    marginBottom={40}
    marginRight={30}>
    <AxisX anchor="top" tickSize={10} tickFontSize="14px" />
    <AxisX stroke="cornflowerblue" fill="cornflowerblue" />
    <AxisY
        fill="green"
        anchor="right"
        tickSize={-5}
        tickPadding={10} />
    <AxisY
        stroke="magenta"
        fill="#dd0000"
        ticks={[0, 1.5, 2, 2.5, 4, 5]} />
</Plot>
```

The automatic ticks can be customized using the <b>tickSpacing</b> option:

```svelte
<Plot
    x={{ tickSpacing: 150 }}
    y={{ tickSpacing: 10 }}
    testid="tickspacing">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```



Ordinal axis:

```svelte live
<script>
    import { Plot, RuleY } from '$lib';
</script>

<Plot
    x={{
        domain: 'These are some ordinal ticks on a band scale'.split(
            ' '
        )
    }} />
```

```svelte
<Plot
    x={{
        domain: 'These are some ordinal ticks on a band scale'.split(
            ' '
        )
    }} />
```

You can rotate tick labels using `tickRotate`:

```svelte live
<script>
    import { Plot, RuleY } from '$lib';
    import { Slider } from '$lib/ui';

    let tickRotate = $state(-45);
</script>

<Slider
    label="tick angle"
    min={-90}
    max={90}
    step={5}
    bind:value={tickRotate} />
<Plot
    marginBottom={50}
    x={{
        tickRotate,
        domain: 'These are some ordinal ticks on a band scale'.split(
            ' '
        )
    }} />
```

```svelte
<Plot
    x={{
        tickRotate: -45,
        domain: 'These are some ordinal ticks on a band scale'.split(
            ' '
        )
    }} />
```

:::warning
Keep in mind that rotated texts are a lot harder to read, so if possible, avoid rotated axis ticks (e.g. by flipping a column chart to bar chart) or at least limit rotation to 45 degrees.
:::

You can assign custom class to ticks based on the tick value by passing a `tickClass` function

```svelte live
<script>
    import { Plot, AxisX } from '$lib';
</script>

<Plot
    marginBottom={50}
    x={{
        domain: [-30, 60]
    }}>
    <AxisX
        tickClass={(d) =>
            d < 0 ? 'negative' : d > 0 ? 'positive' : ''} />
</Plot>

<style>
    :global(.tick.negative text) {
        fill: var(--svp-red) !important;
    }
    :global(.tick.positive text) {
        fill: var(--svp-blue) !important;
    }
</style>
```

```svelte
<Plot x={{ domain: [-30, 60] }}>
    <AxisX
        tickClass={(d) =>
            d < 0 ? 'negative' : d > 0 ? 'positive' : ''} />
</Plot>

<style>
    :global(.tick.negative text) {
        fill: red !important;
    }
    :global(.tick.positive text) {
        fill: blue !important;
    }
</style>
```

You can change the defaults for SveltePlot grids by defining the `svelteplot/defaults` context:

```svelte live
<script>
    import { Plot, Line } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="axis">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<script>
    import { Plot, Line } from 'svelteplot';
    import { setContext } from 'svelte';

    setContext('svelteplot/defaults', {
        tickSize: 0
    });

    let aapl = [
        /* import data etc. */
    ];
</script>

<Plot grid testid="axis">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

## AxisX

You can explicitly add an x axis using the `AxisX` mark component. Here we're using two AxisX marks for two layers of ticks

```svelte live
<script>
    import { Plot, AxisX } from '$lib';
</script>

<Plot
    margins={30}
    marginBottom={50}
    x={{
        domain: [new Date(2022, 0, 1), new Date(2024, 1, 1)]
    }}>
    <AxisX
        interval="quarter"
        tickFormat={(d) => `Q${d.getMonth() / 3 + 1}`} />
    <AxisX
        interval="year"
        tickSize={0}
        tickFontSize={15}
        tickPadding={25}
        tickFormat="YYYY"
        fill="#999" />
</Plot>
```

```svelte
<Plot
    margins={30}
    marginBottom={50}
    x={{
        domain: [new Date(2022, 0, 1), new Date(2024, 1, 1)]
    }}>
    <AxisX
        interval="quarter"
        tickFormat={(d) => `Q${d.getMonth() / 3 + 1}`} />
    <AxisX
        interval="year"
        tickSize={0}
        tickFontSize={15}
        tickPadding={25}
        tickFormat="YYYY"
        fill="#999" />
</Plot>
```

Note that you can achive a similar axis using a custom tick format function that returns an array. Repeating tick text lines are being omitted automatically:

```svelte live
<script>
    import { Plot, AxisX } from '$lib';
</script>

<Plot
    marginLeft={30}
    x={{
        domain: [
            new Date(2022, 0, 1),
            new Date(2024, 1, 1)
        ],
        tickFormat: (d) => [
            `Q${d.getMonth() / 3 + 1}`,
            d.getFullYear()
        ]
    }}>
</Plot>
```

```svelte
<Plot
    x={{
        domain: [
            new Date(2022, 0, 1),
            new Date(2024, 1, 1)
        ],
        tickFormat: (d) => [
            `Q${d.getMonth() / 3 + 1}`,
            d.getFullYear()
        ]
    }}>
</Plot>
```

## AxisY

Options:

- tickSize
- tickPadding

### Ticks inside the plot

To render y axis ticks inside the plot you need to use the explicit axis mark which lets you control `tickSize` and `tickPadding` as well as the vertical offset `dy`. Note that you likely need to adjust the horizontal inset to make sure the ticks don't overlap with your data marks.

```svelte live
<script>
    import { Plot, Line, AxisY } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid x={{ insetLeft: 20 }}>
    <AxisY
        tickSize={0}
        tickPadding={0}
        dy={-5}
        lineAnchor="bottom"
        textAnchor="start" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot grid x={{ insetLeft: 20 }}>
    <AxisY
        tickSize={0}
        tickPadding={0}
        dy={-5}
        lineAnchor="bottom"
        textAnchor="start" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```
