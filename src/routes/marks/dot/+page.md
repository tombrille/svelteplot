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

    const manufactor = (d) => d.name.split(' ')[0];
    let fill = $state(false);
</script>

<input type="checkbox" bind:checked={fill} /> fill symbols<br />

<Plot grid height={500} testid="cars1">
    <Dot
        data={cars}
        x="economy (mpg)"
        y="power (hp)"
        stroke={!fill ? manufactor : null}
        fill={fill ? manufactor : null}
        symbol={manufactor}
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

You can also use a point scale for dot dimensions to create dot plots:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { cars } = $derived($page.data.data);
    const manufactor = (d) => d.name.split(' ')[0];
</script>

<Plot grid testid="cars" y={{ type: 'point' }} marginLeft={80}>
    <Dot data={cars} y={manufactor} x="power (hp)" symbol={manufactor} />
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

```svelte live
<script>
    import { Plot, Dot } from '$lib';

    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

{#if seattle}
    <Plot
        aspectRatio={1}
        inset={10}
        y={{
            ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            tickFormat: (d) =>
                new Intl.DateTimeFormat('en', { month: 'narrow' }).format(new Date(2000, d, 1))
        }}
        testid="seattle-temp"
        let:width
    >
        <Dot
            data={seattle}
            symbol="square"
            r={Math.sqrt(width / 31) * 2}
            filter={(d) => d.date.getUTCFullYear() === 2015}
            x={(d) => d.date.getUTCDate()}
            y={(d) => d.date.getUTCMonth()}
            fill="temp_max"
        />
    </Plot>
{/if}
```
