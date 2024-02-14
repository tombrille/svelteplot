---
title: Bin transform
---

:::caution
The bin transform in SveltePlot takes different options than the bin transform in Plot.
:::

The bin transform groups quantitative or temporal data — continuous measurements such as heights, weights, or temperatures — into discrete bins. You can then compute summary statistics for each bin, such as a count, sum, or proportion.

For example, here is a histogram showing the distribution of weights of Olympic athletes.

```svelte live
<script>
    import { Plot, Rect, RectY, RuleY, binX, stackY } from '$lib';

    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

<Plot height={300}>
    <RectY {...binX({ data: olympians, x: 'weight', y: 'count' })} />
</Plot>
```

```svelte
<Plot height={300}>
    <RectY {...binX({ data: olympians, x: 'weight', y: 'count' })} />
</Plot>
```

You can also bin and group at the same time:

```svelte live
<script>
    import { Plot, Rect, RectY, RuleY, binX, stackY } from '$lib';

    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

<Plot height={300} grid marginLeft={40} color={{ legend: true }}>
    <RectY
        {...binX({ data: olympians, x: 'weight', y: 'count', fill: 'sex' })}
        stack={{ offset: 'center' }}
    />
    <RuleY data={[0]} />
</Plot>
```

By default, the binX transform will set the _insetRight_ channel to 1, but you can disable this by explicitly setting it to zero:

```svelte live
<script>
    import { Plot, Rect, RectY, RuleY, binX, stackY } from '$lib';

    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

<Plot height={200}>
    <RectY {...binX({ data: olympians, x: 'weight', y: 'count' })} insetRight="0" />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot height={200}>
    <RectY
        {...binX(
            { data: penguins, x: 'culmen_length_mm', y: 'count' },
            { thresholds: [0, 35, 40, 41, 45, 53, 80] }
        )}
        insetLeft="0"
        insetRight="0"
    />
    <RuleY data={[0]} />
</Plot>
```

You can define _thresholds_ as a number

```svelte live
<script>
    import { Plot, RectY, RuleY, binX } from '$lib';
    import Slider from '$lib/ui/Slider.svelte';

    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);

    let thresholds = $state(20);
</script>

<Slider min={10} max={100} step={10} label="thresholds" bind:value={thresholds} />
<Plot grid marginLeft={50} height={200}>
    <RectY {...binX({ data: olympians, x: 'weight', y: 'count' }, { thresholds })} />
    <RuleY data={[0]} />
</Plot>
```

Or as arbitrary bin bounds:

```svelte live
<script>
    import { Plot, RectY, RuleY, binX } from '$lib';

    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot height={200}>
    <RectY
        {...binX(
            { data: penguins, x: 'culmen_length_mm', y: 'count' },
            { thresholds: [0, 35, 40, 41, 45, 53, 80] }
        )}
    />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot height={200}>
    <RectY
        {...binX(
            { data: penguins, x: 'culmen_length_mm', y: 'count' },
            { thresholds: [0, 35, 40, 41, 45, 53, 80] }
        )}
    />
    <RuleY data={[0]} />
</Plot>
```

## BinY

```svelte live
<script>
    import { Plot, RectX, RuleX, binY } from '$lib';

    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

<Plot grid>
    <RectX {...binY({ data: olympians, y: 'weight', x: 'count' }, { reverse: true })} />
    <RuleX data={[0]} />
</Plot>
```
