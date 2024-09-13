---
title: Dot mark
---

The dot mark draws circles or other symbols positioned in **x** and **y** as in a scatterplot.
For example, the chart below shows the roughly-inverse relationship between car horsepower in
y↑ and fuel efficiency in miles per gallon in x→.

```svelte live
<script>
    import { Plot, Dot } from '$lib';

    import { page } from '$app/stores';
    let { cars } = $derived($page.data.data);

    let fill = $state(false);
    let canvas = $state(false);
</script>

<input type="checkbox" bind:checked={fill} /> fill symbols<br />

<Plot grid height={500} testid="cars1">
    <Dot
        {canvas}
        data={cars}
        x="economy (mpg)"
        y="power (hp)"
        stroke={!fill ? 'manufactor' : null}
        fill={fill ? 'manufactor' : null}
        symbol="manufactor"
    />
</Plot>
```

When showing plots with a lot of dots, you can switch to canvas rendering to improve the performance. Here are 20,000 randomly distributed dots:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { range } from 'd3-array';
    import { randomNormal } from 'd3-random';

    const randX = randomNormal();
    const randY = randomNormal();

    let fill = $state(false);
</script>

<input type="checkbox" bind:checked={fill} /> fill symbols<br />

<Plot>
    <Dot
        fill={fill ? 'currentColor' : null}
        stroke={!fill ? 'currentColor' : null}
        opacity={0.4}
        canvas
        data={range(20000).map((i) => [randX(), randY()])}
    />
</Plot>
```

dsdsd sd sd sdsd sd

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid height={500} color={{ legend: true }} testid="penguins">
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species"
    />
</Plot>
```

One more

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);

    let maxRad = $state(10);
</script>

max radius: <input type="range" bind:value={maxRad} min={0} max={20} /><br />

<Plot grid r={{ range: [0, maxRad] }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        r={(d) => Math.pow(d.culmen_length_mm * d.culmen_depth_mm, 4)}
        fill="sex"
    />
</Plot>
```

You can also use a point scale for dot dimensions to create dot plots, such as this recreation of William S. Cleveland's dot plot from [The Elements of Graphing Data (1985)](https://archive.org/details/elementsofgraphi0000clev):

```svelte live
<script>
    import { Plot, Dot, GridY, AxisX } from '$lib';
    import { page } from '$app/stores';
    let { languages } = $derived($page.data.data);
</script>

<Plot
    frame
    inset={10}
    testid="languages"
    x={{
        type: 'log',
        domain: [50e6, 2000e6],
        axis: 'both',
        label: 'NUMBER OF SPEAKERS',
        labelAnchor: 'center'
    }}
    y={{ type: 'point', label: '' }}
    marginTop={40}
    marginBottom={40}
>
    <GridY strokeDasharray="1,3" strokeOpacity="0.5" />
    <Dot
        data={languages.filter((d) => d['Total speakers'] >= 70)}
        fill="currentColor"
        sort={{ channel: '-x' }}
        y="Language"
        x={(d) => d['Total speakers'] * 1e6}
    />
</Plot>
```

## DotX

Using the **DotX** mark, you can quickly plot a list of numbers as dots:

```svelte live
<script>
    import { Plot, DotX } from '$lib';
    import { page } from '$app/stores';
    let { cars } = $derived($page.data.data);
</script>

<Plot testid="dotx">
    <DotX data={cars.map((d) => d['economy (mpg)'])} />
</Plot>
```

## DotY

Using the <b>DotY</b> mark, you can quickly plot a list of numbers as dots:

```svelte live
<script>
    import { Plot, DotY } from '$lib';
    import { page } from '$app/stores';
    let { cars } = $derived($page.data.data);
</script>

<Plot testid="doty">
    <DotY data={cars.map((d) => d['economy (mpg)'])} />
</Plot>
```

## More examples

You can use the color channel for encoding a third quantitative variable.

```svelte live
<script lang="ts">
    import { Plot, Dot, RuleY } from '$lib';
    import { page } from '$app/stores';
    let { simpsons } = $derived($page.data.data);

    let decline = $state(false);
</script>

<!-- <button onclick={() => decline = !decline}>change story</button> -->

<Plot
    grid
    color={{
        legend: false,
        type: 'linear',
        domain: decline ? null : [1, 10],
        scheme: 'rdylgn',
        label: 'IMDB rating'
    }}
>
    <Dot data={simpsons} y="imdb_rating" fill="imdb_rating" x="airdate" />
    {#if !decline}
        <RuleY data={[1]} />
    {/if}
</Plot>
```
