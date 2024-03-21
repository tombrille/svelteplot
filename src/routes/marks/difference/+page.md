---
title: Difference mark
---

The difference mark can be used to fill the areas between two lines colored based on which line is on top of the other.

```svelte live
<script>
    import { Plot, Line, DifferenceY } from '$lib';
    import { page } from '$app/stores';
    let { trade } = $derived($page.data.data);
</script>

<Plot grid>
    <DifferenceY
        data={trade}
        x="Year"
        y1="Imports"
        y2="Exports"
        curve="basis"
        opacity="0.3"
        positiveFill="var(--svp-blue)"
        negativeFill="var(--svp-red)"
    />
    <Line data={trade} x="Year" y="Imports" stroke="var(--svp-red)" curve="basis" />
    <Line data={trade} x="Year" y="Exports" stroke="var(--svp-blue)" curve="basis" />
</Plot>
```

```svelte
<Plot grid>
    <DifferenceY
        data={trade}
        x="Year"
        y1="Imports"
        y2="Exports"
        curve="basis"
        opacity="0.3"
        positiveFill="blue"
        negativeFill="red"
    />
    <Line data={trade} x="Year" y="Imports" stroke="red" curve="basis" />
    <Line data={trade} x="Year" y="Exports" stroke="blue" curve="basis" />
</Plot>
```

If just one _x_ and _y_ channel is defined the line will be subtracted from zero automatically

```svelte live
<script>
    import { Plot, Line, DifferenceY, windowY, RuleY } from '$lib';
    import { page } from '$app/stores';
    let { gistemp } = $derived($page.data.data);
</script>

<Plot height={350} y={{ grid: true }}>
    <DifferenceY
        stroke
        fillOpacity="0.7"
        {...windowY({ data: gistemp, x: 'Date', y: 'Anomaly' }, { k: 14 })}
        positiveFill="var(--svp-red)"
        negativeFill="var(--svp-blue)"
    />
    <RuleY data={[0]} />
    <!-- <DifferenceY {...windowY({ data: 'gistemp', x: 'Date', y: 'Anomaly' }, { k: 14 })} /> -->
</Plot>
```

```svelte
<Plot height={350} y={{ grid: true }}>
    <DifferenceY
        stroke
        fillOpacity="0.7"
        {...windowY({ data: gistemp, x: 'Date', y: 'Anomaly' }, 
            { k: 14 })}
        positiveFill="red"
        negativeFill="blue"
    />
    <RuleY data={[90]} />
</Plot>
```

You can set a different "baseline" by providing a constant y1 channel

```svelte live
<script>
    import { Plot, Line, DifferenceY, windowY, RuleY } from '$lib';
    import { page } from '$app/stores';
    import { Slider } from '$lib/ui';
    let y1 = $state(0.2);
    let { gistemp } = $derived($page.data.data);
</script>

<Slider label="y1" min={-0.4} max={1} step={0.01} bind:value={y1} />
<Plot height={350} y={{ grid: true }}>
    <DifferenceY
        stroke
        fillOpacity="0.7"
        {...windowY({ data: gistemp, x: 'Date', y: 'Anomaly', y1 }, { k: 14 })}
        positiveFill="var(--svp-red)"
        negativeFill="var(--svp-blue)"
    />
     <RuleY data={[y1]} />
</Plot>
```

```svelte
<Plot height={350} y={{ grid: true }}>
    <DifferenceY
        stroke
        fillOpacity="0.7"
        {...windowY({ data: gistemp, x: 'Date', y: 'Anomaly', y1 }, { k: 14 })}
        positiveFill="red"
        negativeFill="blue"
    />
     <RuleY data={[y1]} />
</Plot>
```

In combination with the [shift transform](/transforms/shift) you can compare a series to itself. The chart below shows year-over-year growth in the price of Apple stock.

```svelte live
<script>
    import { Plot, Line, DifferenceY, shiftX, RuleX } from '$lib';
    import { page } from '$app/stores';
    import { Slider } from '$lib/ui';

    let { aapl } = $derived($page.data.data);
    let days = $state(365);
</script>

<Slider label="days" min={0} max={700} bind:value={days} />
<Plot height={350} grid>
    <DifferenceY
        stroke
        {...shiftX({ data: aapl, x: 'Date', y: 'Close' }, { x1: `+${days} days` })} 
        positiveFill="var(--svp-green)"
        negativeFill="var(--svp-red)"
    />
</Plot>
```

```svelte
<Plot height={350} grid>
    <DifferenceY
        stroke
        {...shiftX({ data: aapl, x: 'Date', y: 'Close' }, 
            { x1: `+${days} days` })}
        positiveFill="green"
        negativeFill="red"
    />
</Plot>
```

## Difference options

- x, x1, x2
- y, y1, y2
- positiveFill
- negativeFill

## DifferenceY