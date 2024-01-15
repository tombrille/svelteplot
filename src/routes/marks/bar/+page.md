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
