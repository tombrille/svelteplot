---
title: Introduction
description: How to use SveltePlot
lastUpdate: 2024-01-10
---

<script lang="ts">
    import { Plot, Frame, Dot, DotX, DotY, GridX, GridY } from '$lib/index.js';
    import RuleX from '$lib/marks/RuleX.svelte';
    import CandlestickExample from '../marks/rule/CandlestickExample.svelte';

    let marginLeft = $state(30);
    let marginRight = $state(20);
    let marginTop = $state(5);
    let marginBottom = $state(20);

    const demoData = [
        { x: 0, y: 0, size: 6 },
        { x: 1, y: 1, size: 5 },
        { x: 2, y: 2, size: 3 },
        { x: 4, y: 3, size: 6 },
        { x: 5, y: 1, size: 5 },
        { x: 6, y: 2, size: 3 },
        { x: 8, y: 0.25, size: 6 },
        { x: 9, y: 2, size: 5 },
        { x: 11, y: 1, size: 3 }
    ];

    let cutoff = $state(demoData.length);
    let maxRad = $state(6);
    let hasFrame = $state(true);
    let useData = $derived(demoData.slice(0, cutoff));
</script>

This is a nice page

## Hello world

<CandlestickExample />

```svelte
<script>
    import { Plot } from 'svelteplot';
</script>

<Plot>
    
</Plot>
```

Another test:

