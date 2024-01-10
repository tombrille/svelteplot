---
title: Area mark
---

<script lang="ts">
    // import { Plot, Frame, Area, AreaX, AreaY, Line, RuleY } from '$lib/index.js';

    import AreaLineRulePlot from './AreaLineRulePlot.svelte';
    import AreaY1Plot from './AreaY1Plot.svelte';
</script>

The **area mark** draws the region between a baseline (x1, y1) and a topline (x2, y2) as in an area chart. Often the baseline represents y = 0, and because the area mark interpolates between adjacent data points, typically both the x and y scales are quantitative or temporal.

<AreaY1Plot />

```svelte
<Plot>
    <AreaY data={aapl} x="Date" y="Close" />
</Plot>
```

### Area



The **Area** mark is useful for area charts. It pairs nicely with a <b>Line</b> mark for
the topline and a <b>RuleY</b> for the baseline:

<AreaLineRulePlot />


```svelte
<Plot grid>
    <Area data={aapl} x1="Date" y1={0} y2="Close" opacity={0.25} />
    <Line data={aapl} x="Date" y="Close" />
    <RuleY data={[0]} />
</Plot>
```
    
Typically, you won't want to use the <b>Area</b> mark directly, but want to use <b>AreaY</b>
for "horizontal" area charts, where the time axis going from left to right:
    


If you need a different baseline you can pass <b>y1</b> and <b>y2</b> channels instead of
<b>y</b>:

<!-- 
<Plot grid testid="area-y2">
    <AreaY data={aapl} x="Date" y1={100} y2="Close" />
</Plot> -->

```svelte
<!-- <Code
    code={`<Plot grid>
<AreaY data={aapl} x="Date" y1={100} y2="Close"  />
</Plot>`}
/> -->
```

You can also just pass an array of numbers to <b>AreaY</b> for a quick plot<

<!-- <Plot testid="area-y-numbers" grid height={200} y={{ ticks: [-1, 0, 1] }}>
    <AreaY data={range(100).map((v) => Math.cos(v / 5))} opacity={0.5} />
    <RuleY data={[0]} />
</Plot> -->


<!-- <Code
    code={`<Plot grid height={200} y={{ ticks: [-1, 0, 1]}}>
<AreaY data={range(100).map((v) => Math.cos(v / 5))} opacity={0.5}  />
<RuleY data={[0]} />
</Plot>`}
/> -->
```

For "vertical" area charts you can use the <b>AreaX</b> mark as shorthand

<Plot grid testid="area-x" height={600} maxWidth="300px">
    <AreaX data={aapl} y="Date" x="Close" />
</Plot>

TODO: transform data for stacked areas

