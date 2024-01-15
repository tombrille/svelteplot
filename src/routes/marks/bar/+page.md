---
title: Bar mark
---

<script>
    import BarPlot from './BarPlot.svelte';
    import StackedBarPlot from './StackedBarPlot.svelte';
</script>

Bars are cool. They come in two flavors: [BarY](#BarY) for vertical bars (columns) and [BarX](#BarX) for horizontal bars.

## BarY

<BarPlot />

@code(./BarPlot.svelte)

In its simplest form, you can just pass a few numbers as Data to create a bar chart, but remember to set the x scale type to `band`: 

```svelte live
<script>
    import { Plot, BarY, RuleY } from '$lib';
</script>

<Plot x={{type:'band'}}>
    <BarY data={[1,2,3,4,5]} />
    <RuleY data={[0]} />
</Plot>
```
```svelte
<Plot x={{type:'band'}}>
    <BarY data={[1,2,3,4,5]} />
    <RuleY data={[0]} />
</Plot>
```


You can create stacked bar charts, too:

<StackedBarPlot />

@code(./StackedBarPlot.svelte)

-   `x`
-   `y1`
-   `y2`

## BarX

-   `y`
-   `x1`
-   `x2`
