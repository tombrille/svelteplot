---
title: Test
---
```svelte
<Plot color={{ legend: true }} x={{ grid: true }} inset={10}>
    <Dot data={olympians} x="height" y="weight" stroke="sex" symbol="sex" />
    <RuleY data={[0]} />
</Plot>
```

We can use the [binX transform](/transforms/bin) to compute a weight distribution.

```svelte live
<script>
    import { Plot, Dot, RectY, GridY, AxisX, AxisY, RuleY, DotX, binX } from '$lib';
    import Mark from '$lib/Mark.svelte';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { olympians } = $derived(getData());
</script>

{#if olympians}
    <Plot>
        <RectY {...binX({ data: olympians, x: 'weight', y: 'count', fill: 'sex' })} />
        <RuleY data={[0]} />
    </Plot>
{/if}
```