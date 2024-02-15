---
title: Test
---


```svelte live
<script lang="ts">
    import { Plot, Dot, RuleY, RegressionY } from '$lib';
    import { page } from '$app/stores';
    import { Select, Slider } from '$lib/ui';

    let { simpsons } = $derived($page.data.data);

    let type = $state('linear');
    let order = $state(3);
    let bandwidth = $state(0.3);
    let confidence = $state(0.99);
    const types = ['linear', 'quad', 'poly', 'exp', 'log', 'pow', 'loess'];
</script>

<Select label="Type" bind:value={type} options={types} />
{#if type === 'poly'}<Slider label="order" bind:value={order} min={2} max={6} />{/if}
{#if type === 'loess'}<Slider
        label="bandwidth"
        bind:value={bandwidth}
        min={0}
        max={0.9}
        step={0.01}
    />{/if}
{#if type !== 'loess'}<Slider
        label="confidence"
        bind:value={confidence}
        min={0.8}
        max={0.999999}
        step={0.000001}
    />{/if}

<Plot grid>
    <Dot data={simpsons} y="imdb_rating" x="airdate" symbol="plus" stroke="#999" opacity={0.6} />
    <RegressionY
        data={simpsons}
        {type}
        {order}
        {bandwidth}
        {confidence}
        stroke="red"
        y="imdb_rating"
        x="airdate"
    />
</Plot>
```
