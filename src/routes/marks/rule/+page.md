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
    <RuleY data={[0]} /> // [svp! hl]
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

## RuleX

For vertical lines

## RuleY

For horizontal lines
