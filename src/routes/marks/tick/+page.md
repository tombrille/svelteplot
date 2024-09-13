---
title: Tick mark
---

Ticks are useful for showing one-dimensional distributions, as in the "barcode" plot below. The secondary dimension must be a band scale.

## TickX

Shows a vertical bar for each x position.

```svelte live
<script lang="ts">
    import { Plot, RuleX, TickX } from '$lib/index.js';
    import { page } from '$app/stores';
    let { stateage } = $derived($page.data.data);
</script>

<Plot x={{ grid: true, percent: true }}>
    <RuleX data={[0]} />
    <TickX data={stateage} y="age" x="pop_share" />
</Plot>
```

```svelte
<Plot x={{ grid: true, percent: true }}>
    <RuleX data={[0]} />
    <TickX data={stateage} y="age" x="pop_share" />
</Plot>
```

## TickY

Shows a horizontal bar for each x position.

```svelte live
<script lang="ts">
    import { Plot, RuleY, TickY } from '$lib/index.js';

    import { page } from '$app/stores';
    let { stateage } = $derived($page.data.data);

    let padding = $state(0.3);
    let align = $state(0.5);
</script>

<label style="margin-right:2em"
    >padding: <input type="range" min={0} max={1} step={0.01} bind:value={padding} />
    {padding}</label
>
<label
    >align: <input type="range" min={0} max={1} step={0.01} bind:value={align} />
    {align}</label
>

<Plot x={{ padding, align }} y={{ grid: true, percent: true }}>
    <RuleY data={[0]} />
    <TickY data={stateage} x="age" y="pop_share" />
</Plot>
```

```svelte
<Plot y={{ grid: true, percent: true }}>
    <RuleY data={[0]} />
    <TickY data={stateage} x="age" y="pop_share" />
</Plot>
```

Same idea but with facet:

```svelte live
<script lang="ts">
    import { Plot, RuleY, TickY } from '$lib/index.js';

    import { page } from '$app/stores';
    let { stateage } = $derived($page.data.data);
</script>

<Plot y={{ grid: true, percent: true }}>
    <RuleY data={[0]} />
    <TickY data={stateage} fx="age" y="pop_share" />
</Plot>
```

```svelte
<Plot y="{{ grid: true, percent: true }}}">
    <RuleY data={[0]} />
    <TickY data={stateage} fx="age" y="pop_share" />
</Plot>
```
