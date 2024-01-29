---
title: Bar mark
---

<script>
    import BarPlot from './BarPlot.svelte';
    import StackedBarPlot from './StackedBarPlot.svelte';
</script>

Bars are cool. They come in two flavors: [BarY](#BarY) for vertical bars (columns) and [BarX](#BarX) for horizontal bars.

## BarX

Here's a very simple bar chart:

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib/fresh';
</script>

<Plot y={{ type: 'band' }} x={{ grid: true }} height={200} marginTop={0}>
    <BarX data={[1, 2, 3, 4, 5]} />
    <RuleX data={[0]} />
</Plot>
```

```svelte
<Plot y={{ type: 'band' }} x={{ grid: true }} height={120}>
    <BarX data={[1, 2, 3, 4, 5]} />
    <RuleX data={[0]} />
</Plot>
```

You can create bullet bars using the `inset` option and two `BarX` layers:

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib/fresh';
</script>

<Plot y={{ type: 'band' }} height={200} marginTop={0}>
    <BarX data={[2.3, 4, 5, 3.7, 5.4]} opacity={0.3} />
    <BarX data={[1, 2, 3, 4, 5]} inset={8} />
</Plot>
```

## BarY

<BarPlot />

@code(./BarPlot.svelte)

In its simplest form, you can just pass a few numbers as data to create a bar chart, but remember to set the x scale type to `band`:

```svelte live
<script>
    import { Plot, BarY, RuleY } from '$lib';
</script>

<Plot x={{ type: 'band' }}>
    <BarY data={[1, 2, 3, 4, 5]} />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot x={{ type: 'band' }}>
    <BarY data={[1, 2, 3, 4, 5]} />
    <RuleY data={[0]} />
</Plot>
```

You can create stacked bar charts, too:

<StackedBarPlot />

@code(./StackedBarPlot.svelte)

-   `x`
-   `y1`
-   `y2`

-   `y`
-   `x1`
-   `x2`
