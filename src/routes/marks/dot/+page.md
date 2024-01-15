---
title: Dot mark
---

The dot mark draws circles or other symbols positioned in **x** and **y** as in a scatterplot.
For example, the chart below shows the roughly-inverse relationship between car horsepower in
y↑ and fuel efficiency in miles per gallon in x→.

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { getContext } from 'svelte';
    const { cars } = getContext('data');
    const manufactor = (d) => d.name.split(' ')[0];
    let fill = $state(false);
</script>

<input type="checkbox" bind:checked={fill} /> fill symbols<br />

<Plot grid height={500} testid="cars">
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
    import { getContext } from 'svelte';
    const { penguins } = getContext('data');
</script>

<Plot grid height={500} symbol={{ legend: true }} testid="penguins">
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

    const demoData = [
        { x: 0, y: 0, size: 6 },
        { x: 1, y: 1, size: 5 },
        { x: 2, y: 2, size: 1 },
        { x: 4, y: 3, size: 8 },
        { x: 5, y: 1, size: 5 },
        { x: 6, y: 2, size: 3 },
        { x: 8, y: 0.25, size: 20 },
        { x: 9, y: 2, size: 5 },
        { x: 11, y: 1, size: 3 }
    ];

    let maxRad = $state(10);
</script>

max radius: <input type="range" bind:value={maxRad} min={0} max={20} /><br />

<Plot grid radius={{ range: [1, maxRad] }}>
    <Dot
        data={demoData}
        x="x"
        y="y"
        r="size"
        fill={(d) => (d.x < 5 ? 'red' : 'blue')}
        stroke="black"
    />
</Plot>
```

You can also use a point scale for dot dimensions:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { getContext } from 'svelte';
    const { cars } = getContext('data');
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
    import { getContext } from 'svelte';
    const { cars } = getContext('data');
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
    import { getContext } from 'svelte';
    const { cars } = getContext('data');
</script>

<Plot testid="doty">
    <DotY data={cars.map((d) => d['economy (mpg)'])} />
</Plot>
```
