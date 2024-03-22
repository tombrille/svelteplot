---
title: Rule mark
---

Rules can be used for highlighting certain axis values, most commonly zero. They come in two variants: [RuleX](#RuleX) for vertical lines and [RuleY](#RuleY) for horizontal lines.

```svelte live
<script lang="ts">
    import { Plot, Line, RuleY } from '$lib';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot height={350}>
    <RuleY data={[0, 100]} />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot>
    <RuleY data={[0, 100]} />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

Rules can be used for barcode plots:

```svelte live
<script lang="ts">
    import { Plot, RuleX } from '$lib/index.js';
    import { range } from 'd3-array';
    import { randomNormal, randomLcg } from 'd3-random';

    const seededNormal = randomNormal.source(randomLcg(0.12345));
</script>

<Plot testid="barcode" margins={0} marginBottom={35} height={70}>
    <RuleX data={range(500).map(seededNormal(0, 1))} strokeOpacity={0.5} />
</Plot>
```

Or candlestick

```svelte live
<script lang="ts">
    import { Plot, RuleX } from '$lib/index.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid height={250} testid="candlestick">
    <RuleX data={aapl.slice(750, 800)} x="Date" y1="Low" y2="High" strokeWidth="2" opacity="0.5" />
    <RuleX
        data={aapl.slice(750, 800)}
        x="Date"
        y1="Open"
        y2="Close"
        strokeWidth="5"
        stroke={(d) => ((d as AAPL).Close > (d as AAPL).Open ? 'var(--svp-green)' : 'var(--svp-red)')}
    />
</Plot>
```

```svelte
<Plot grid>
    <RuleX data={aapl.slice(750, 800)} x="Date" y1="Low" y2="High" strokeWidth="2" opacity="0.3" />
    <RuleX
        data={aapl.slice(750, 800)}
        x="Date"
        y1="Open"
        y2="Close"
        strokeWidth="5"
        stroke={(d) => (d.Close > d.Open ? 'green' : 'red')}
    />
</Plot>
```

## RuleX

For vertical lines

## RuleY

For horizontal lines
