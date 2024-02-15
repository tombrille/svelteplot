---
title: Cell mark
---

The **cell mark** draws rectangles positioned in two ordinal dimensions. Hence, the plot’s _x_ and _y_ scales are [band scales](https://observablehq.com/plot/features/scales). Cells typically also have a **fill** color encoding.

For example, the heatmap below shows the decline of _The Simpsons_ after Season 9: high IMDb ratings are dark green, while low ratings are dark pink.

```svelte live
<script>
    import { Plot, Cell, Text } from '$lib';

    import { page } from '$app/stores';
    let { simpsons } = $derived($page.data.data);
</script>

<Plot
    grid
    padding={0}
    aspectRatio={1}
    marginTop={40}
    x={{ type: 'band', axis: 'top' }}
    y={{ type: 'band' }}
    color={{ type: 'linear', scheme: 'PiYG' }}
    testid="simpsons"
>
    <Cell data={simpsons} x="episode" y="season" fill="imdb_rating" inset={0.5} />
    <Text
        data={simpsons}
        y="season"
        x="episode"
        fontSize={9}
        fill="black"
        text={(d) => d.imdb_rating && d.imdb_rating.toFixed(1)}
        title={(d) => d.title}
    />
</Plot>
```

Seattle temperatures

```svelte live
<script>
    import { Plot, Cell, formatMonth } from '$lib';

    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot
    padding={0}
    aspectRatio={1}
    y={{
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tickFormat: formatMonth('en', 'short')
    }}
    testid="seattle-temp"
>
    <Cell
        data={seattle}
        filter={(d) => d.date.getUTCFullYear() === 2015}
        x={(d) => d.date.getUTCDate()}
        y={(d) => d.date.getUTCMonth()}
        fill="temp_max"
        inset="0.5"
    />
</Plot>
```

## CellX

Equivalent to [cell](/marks/cell#Cell), except that if the **x** option is not specified, it defaults to \[0, 1, 2, …\], and if the **fill** option is not specified and **stroke** is not a channel, the fill defaults to the identity function and assumes that _data_ = \[_x₀_, _x₁_, _x₂_, …\].

```svelte live
<script>
    import { Plot, CellX, Text } from '$lib';

    import { page } from '$app/stores';
    let { simpsons } = $derived($page.data.data);
    let first28 = $derived(simpsons.filter((d) => d.season < 29));
</script>

<Plot
    padding={0}
    margins={5}
    marginTop={40}
    height={70}
    inset={0}
    x={{
        type: 'band',
        axis: 'top',
        label: 'Season',
        ticks: first28.filter((d) => d.episode === 1).map((d) => d.id),
        tickFormat: (x) => first28.find((d) => d.id === x).season
    }}
    color={{ type: 'linear', scheme: 'PiYG' }}
    testid="first28"
>
    <CellX data={first28.sort((a, b) => b.id - a.id)} x="id" fill="imdb_rating" />
</Plot>
```

```svelte
<Plot
    x={{
        type: 'band',
        axis: 'top',
        label: 'Season',
        ticks: simpsons.filter((d) => d.episode === 1).map((d) => d.id),
        tickFormat: (x) => simpsons.find((d) => d.id === x).season
    }}
    color={{ type: 'linear', scheme: 'PiYG' }}
>
    <CellX data={simpsons.sort((a, b) => b.id - a.id)} x="id" fill="imdb_rating" />
</Plot>
```

But better to use a RectX here:

```svelte --live
<script>
    import { Plot, RectX, Text } from '$lib';

    import { page } from '$app/stores';
    let { simpsons } = $derived($page.data.data);
    let first28 = $derived(simpsons.filter((d) => d.season < 29));
</script>

<Plot
    padding={0}
    margins={5}
    marginTop={40}
    height={70}
    inset={0}
    x={{
        axis: 'top',
        label: 'Season'
    }}
    color={{ type: 'linear', scheme: 'PiYG' }}
>
    <RectX data={first28.sort((a, b) => b.id - a.id)} x="id" interval="1" fill="imdb_rating" />
</Plot>
```
