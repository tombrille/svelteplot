---
title: Sort transform
---

By default, ordinal scales are sorted alphabetically.

```svelte live
<script>
    import { Plot, BarY, RuleY, sort } from '$lib';
    import { Slider } from '$lib/ui';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y="frequency" />
</Plot>
```

```svelte
<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y="frequency" />
</Plot>
```

But you can change the sorting using the **sort** transform option, which will cause the marks to sort the data.

```svelte live
<script>
    import { Plot, BarY, RuleY, sort } from '$lib';
    import { Slider } from '$lib/ui';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        data={alphabet}
        x="letter"
        y="frequency"
        sort={{ channel: 'y' }} />
</Plot>
```

```svelte
<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        data={alphabet}
        x="letter"
        y="frequency"
        sort={{ channel: 'y' }} />
</Plot>
```

To invert the channel sorting, you can either add `order: 'descending` to the sort object or prefix the channel name with a `-` character:

```svelte live
<script>
    import { Plot, BarY, RuleY, sort } from '$lib';
    import { Slider } from '$lib/ui';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        data={alphabet}
        x="letter"
        y="frequency"
        sort={{ channel: '-y' }} />
</Plot>
```

```svelte
<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        data={alphabet}
        x="letter"
        y="frequency"
        sort={{ channel: '-y' }} />
</Plot>
```

## sort

Sorts the data.

```svelte live
<script>
    import { Plot, BarY, RuleY, sort } from '$lib';
    import { Slider } from '$lib/ui';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y="frequency" />
</Plot>
```

```svelte live
<script>
    import { Plot, BarY, RuleY, sort } from '$lib';
    import { Slider } from '$lib/ui';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        {...sort({
            data: alphabet,
            x: 'letter',
            y: 'frequency',
            sort: 'letter'
        })} />
</Plot>
```

## shuffle

Shuffles the data randomly. If a **seed** option is specified, a [linear congruential generator](https://d3js.org/d3-random#randomLcg) with the given seed is used to generate random numbers; otherwise, `Math.random` is used.

```svelte live
<script>
    import { Plot, BarY, RuleY, shuffle } from '$lib';
    import { Slider } from '$lib/ui';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);

    let seed = $state(42);
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        {...shuffle(
            { data: alphabet, x: 'letter', y: 'frequency' },
            { seed }
        )} />
</Plot>

<Slider label="seed" type="number" bind:value={seed} />
{seed}
```

```svelte
<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        {...shuffle(
            { data: alphabet, x: 'letter', y: 'frequency' },
            { seed: 42 }
        )} />
</Plot>
```

## reverse

The reverse transform reverses the data order:

```svelte live
<script lang="ts">
    import { Plot, BarY, RuleY, reverse } from '$lib';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        {...reverse({
            data: alphabet,
            x: 'letter',
            y: 'frequency'
        })} />
</Plot>
```

```svelte
<script lang="ts">
    import { Plot, BarY, RuleY, reverse } from '$lib';
    // ...
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY
        {...reverse({
            data: alphabet,
            x: 'letter',
            y: 'frequency'
        })} />
</Plot>
```

:::tip
There's a simpler way to reverse the order of a band scale by setting `reverse: true` in the scale options.
:::

```svelte live
<script lang="ts">
    import { Plot, BarY, RuleY, reverse } from '$lib';
    import { getContext } from 'svelte';

    import { page } from '$app/stores';
    let { alphabet } = $derived($page.data.data);
</script>

<Plot
    grid
    x={{ reverse: true }}
    y={{ percent: true }}
    marginTop={25}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y="frequency" />
</Plot>
```

```svelte
<Plot
    grid
    x={{ reverse: true }}
    y={{ percent: true }}
    marginTop={25}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y="frequency" />
</Plot>
```
