---
title: Test
---

This is a page with a single chart or easier debugging.

```svelte live
<script lang="ts">
    import { Plot, RuleY, TickY } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import { uniq } from 'underscore';
    import Slider from '$lib/ui/Slider.svelte';

    const { stateage } = getContext<Datasets>('data');

    let padding = $state(0.3);
    let align = $state(0.5);
</script>

<Slider label="padding" bind:value={padding} min={0} max={1} step={0.01} />
<Slider label="align" bind:value={align} min={0} max={1} step={0.01} />

<Plot grid x={{ padding, align }} y={{ grid: true, percent: true }} marginLeft={50}>
    <RuleY data={[0]} />
    <TickY data={stateage} x="age" y="pop_share" />
</Plot>
```
