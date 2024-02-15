---
title: Regression mark
---

Regression

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

Grouping, Simpsons paradox, bla bla

```svelte live
<script>
    import { Plot, Dot, RegressionY } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid height={500} color={{ legend: true }} testid="penguins">
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" fill="species" />
    <RegressionY data={penguins} x="culmen_length_mm" y="culmen_depth_mm" />
    <RegressionY data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
</Plot>
```

Grouping *and* faceting:

```svelte live
<script>
    import { Plot, Dot, RegressionY } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid frame aspectRatio={1} inset={5}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" fill="#999" opacity={0.2} />
    <Dot data={penguins} x="culmen_length_mm" fx="species" y="culmen_depth_mm" fill="species" />
    <RegressionY data={penguins} x="culmen_length_mm" fx="species" y="culmen_depth_mm" stroke="species" />
</Plot>
```

```svelte
<Plot grid frame aspectRatio={1} inset={5}>
    <Dot 
        data={penguins} 
        x="culmen_length_mm" 
        y="culmen_depth_mm" 
        fill="#999" 
        opacity={0.2} />
    <Dot 
        data={penguins} 
        x="culmen_length_mm" 
        fx="species" 
        y="culmen_depth_mm" 
        fill="species" />
    <RegressionY 
        data={penguins} 
        x="culmen_length_mm" 
        fx="species" 
        y="culmen_depth_mm" 
        stroke="species" />
</Plot>
```

## RegressionY

Returns a linear regression mark where y is the dependent variable and x is the independent variable. (This is the common orientation.)

```svelte live
<script lang="ts">
    import { Plot, Dot, RuleY, RegressionY } from '$lib';
    import { page } from '$app/stores';
    import { Select, Slider } from '$lib/ui';

    let { simpsons } = $derived($page.data.data);
</script>

<Plot grid>
    <Dot data={simpsons} y="imdb_rating" x="id" opacity={0.2} />
    <RegressionY data={simpsons} type="linear" stroke="blue" y="imdb_rating" x="id" />
    <RegressionY data={simpsons} type="poly" stroke="red" y="imdb_rating" x="id" />
</Plot>
```

```svelte
<Plot grid>
    <Dot data={simpsons} y="imdb_rating" x="id" opacity={0.2} />
    <RegressionY data={simpsons} type="linear" stroke="blue" y="imdb_rating" x="id" />
    <RegressionY data={simpsons} type="poly" stroke="red" y="imdb_rating" x="id" />
</Plot>
```

## RegressionX

Returns a linear regression mark where x is the dependent variable and y is the independent variable. (This is the uncommon orientation.)

```svelte live
<script lang="ts">
    import { Plot, Dot, RuleY, RegressionX } from '$lib';
    import { page } from '$app/stores';
    import { Select, Slider } from '$lib/ui';

    let { simpsons } = $derived($page.data.data);
</script>

<Plot grid>
    <Dot data={simpsons} y="imdb_rating" x="id" opacity={0.2} />
    <RegressionX data={simpsons} type="linear" stroke="blue" y="imdb_rating" x="id" />
    <RegressionX data={simpsons} type="poly" stroke="red" y="imdb_rating" x="id" />
</Plot>
```

```svelte
<Plot grid>
    <Dot data={simpsons} y="imdb_rating" x="id" opacity={0.2} />
    <RegressionX data={simpsons} type="linear" stroke="blue" y="imdb_rating" x="id" />
    <RegressionX data={simpsons} type="poly" stroke="red" y="imdb_rating" x="id" />
</Plot>
```
