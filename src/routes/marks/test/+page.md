---
title: Test
---

```svelte live
<script>
    import { Plot, Dot, RectY, GridY, AxisX, AxisY, RuleY, DotX, binX } from '$lib';
    import Mark from '$lib/Mark.svelte';

    import { getContext } from 'svelte';
    const getData = getContext('olympians');
    let olympians = $derived(getData());
</script>

{#if olympians}
    <Plot>
        <RectY {...binX({ data: olympians, x: 'weight', y: 'count', fill: 'sex' })} />
        <RuleY data={[0]} />
    </Plot>
{/if}
```

```svelte live
<script>
    import { Plot, RectY, RuleY, binX } from '$lib';
    import Mark from '$lib/Mark.svelte';

    import { getContext } from 'svelte';

    const getData = getContext('olympians');
    let olympians = $derived(getData());
</script>

{#if olympians}
    <Plot grid>
        <RectY {...binX({ data: olympians, x: 'weight', y: 'count', fill: 'sex', fy: 'sex' })} />
        <RuleY data={[0]} />
    </Plot>
{/if}
```
