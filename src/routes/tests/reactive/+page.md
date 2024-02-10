---
title: Reactive playground
---

<script>
    // preload shared datasets
    import { setContext } from 'svelte'; 
    import { csv } from 'd3-fetch';
    import { autoType } from 'd3-dsv';

    let penguins = $state([]);
    let aapl = $state([]);

    $effect(async () => {
        [penguins, aapl] = await Promise.all([
            csv('/data/penguins.csv', autoType),
            csv('/data/aapl.csv', autoType),
        ]);
    });
    setContext('data', () => ({ aapl, penguins }));
</script>

Plot scales react to mark data changes

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { getContext } from 'svelte';
    import Slider from '$lib/ui/Slider.svelte';

    const getData = getContext('data');
    let { aapl } = $derived(getData());

    let cutoff = $state(0);

    let data = $derived(cutoff ? aapl.slice(0, -cutoff) : aapl);
</script>

<Slider label="cutoff" bind:value={cutoff} min={0} max={aapl.length - 10} />
<Plot grid inset={10}>
    <Line {data} x="Date" y="Close" />
</Plot>
```

Plot reacts to channel changes:

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { getContext } from 'svelte';
    import Select from '$lib/ui/Select.svelte';

    const getData = getContext('data');
    let { aapl } = $derived(getData());
    let y = $state('Close');
</script>

<Select label="y" bind:value={y} options={['Open', 'Close', 'Volume']} />
<Plot grid inset={10}>
    <Line data={aapl} x="Date" {y} />
</Plot>
```

## Reactive scales test

```svelte live
<script lang="ts">
    import Slider from '$lib/ui/Slider.svelte';
    import { getContext } from 'svelte';
    import { Plot, Dot, RuleY } from '$lib';

    const getData = getContext('data');
    let { penguins } = $derived(getData());

    let filter = $state(false);
    let minWeight = $state(8000);

    let justGentoo = $derived(penguins.filter((d) => d.species === 'Gentoo'));
    let others = $derived(penguins.filter((d) => d.species !== 'Gentoo'));
</script>

<p>Changing a mark filter should not affect the inferred scale range:</p>
<Slider label="min weight" min={3000} max={8000} bind:value={minWeight} />

<p>But filtering data should:</p>
<label><input type="checkbox" bind:checked={filter} /> just Gentoo</label><br />

{#if penguins.length}
    <Plot grid>
        {#if !filter}
            <Dot
                data={others}
                fill="gray"
                x="culmen_length_mm"
                y="culmen_depth_mm"
                filter={(d) => d.body_mass_g < minWeight}
            />
        {/if}
        <Dot
            data={justGentoo}
            fill="red"
            x="culmen_length_mm"
            y="culmen_depth_mm"
            filter={(d) => d.body_mass_g < minWeight}
        /> />
    </Plot>
{/if}
```
