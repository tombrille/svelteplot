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
