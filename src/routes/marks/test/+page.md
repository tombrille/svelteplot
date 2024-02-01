---
title: Test
---

This is a page with a single chart or easier debugging.

```svelte live
<script lang="ts">
    import { Plot, Arrow, Dot } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import Slider from '$lib/ui/Slider.svelte';
    import Select from '$lib/ui/Select.svelte';

    const data = [
        { x1: 1, y1: 1, x2: 6, y2: 3 },
        { x1: 3, y1: 2, x2: 1, y2: 6 },
        { x2: 3.5, y2: 2.5, x1: 1.5, y1: 6.5 }
    ];

    let sweep = $state(1);
    let inset = $state(10);
    let headLength = $state(20);
    let headAngle = $state(40);
</script>

<Select label="sweep: " options={[-1, 0, 1, '+x', '-x', '+y', '-y']} bind:value={sweep} />
<Slider label="inset" bind:value={inset} />
<Slider label="headLength" bind:value={headLength} />
<Slider label="headAngle" bind:value={headAngle} />
<Plot frame grid margin={20} inset={40}>
    <Dot {data} x="x1" y="y1" symbol="plus" opacity="0.4" />
    <Dot {data} x="x2" y="y2" symbol="circle" opacity="0.4" />
    <Arrow
        {data}
        bend
        {sweep}
        x1="x1"
        y1="y1"
        x2="x2"
        y2="y2"
        {inset}
        {headLength}
        {headAngle}
    />
</Plot>
```
