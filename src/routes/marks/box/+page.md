---
title: Box mark
---

Box marks are a compound mark consisting of a bar, rule, dots and tick marks (see options)

```svelte live
<script>
    import { Plot, BoxX, BoxY } from '$lib';
    import { Slider } from '$lib/ui';

    import { page } from '$app/stores';
    let { countries } = $derived($page.data.data);

    let year = $state(2021);
    let filteredData = $derived(
        countries.filter(
            (d) =>
                d.Year === year &&
                d.Continent &&
                d.Continent !== '#N/A'
        )
    );
</script>

<Slider
    label="year"
    min={1800}
    max={2021}
    bind:value={year} />

<Plot
    inset={5}
    color={{ legend: true }}
    x={{ type: 'log' }}>
    <BoxX
        data={filteredData}
        bar={{ fill: '__y', rx: 6 }}
        tickMinMax
        tickMedian={{ stroke: 'white' }}
        y="Continent"
        x="GDP per capita" />
</Plot>
```

## Options

You can style box plots by passing separate options for the marks

-   **bar** - options passed to the inter-quartile range bar marks
-   **rule** - options passed to the min/max range rule marks
-   **dot** - options passed to the dot marks representing the outliers
-   **tickMedian** - options passed to the tick marks representing the median
-   **tickMinMax** - options passed to the tick marks representing the lower and upper quartiles

## BoxX

```svelte live
<script>
    import { Plot, BoxX } from '$lib';
    import { page } from '$app/stores';
    let { mpg } = $derived($page.data.data);
</script>

<Plot x={{ grid: true }}>
    <BoxX
        data={mpg}
        x="hwy"
        tickMinMax
        y="class"
        dot={{ fill: true }}
        bar={{ fill: 'white', stroke: 'currentColor' }} />
</Plot>
```

```svelte
<Plot x={{ grid: true }}>
    <BoxX
        data={mpg}
        x="hwy"
        tickMinMax
        y="class"
        dot={{ fill: true }}
        bar={{ fill: 'white', stroke: 'currentColor' }} />
</Plot>
```

## BoxY

```svelte live
<script>
    import { Plot, BoxY } from '$lib';
    import { page } from '$app/stores';
    let { mpg } = $derived($page.data.data);
</script>

<Plot grid>
    <BoxY
        data={mpg}
        x="class"
        y="hwy"
        tickMedian={{ stroke: 'white', strokeWidth: 3 }} />
</Plot>
```

```svelte
<Plot grid>
    <BoxY
        data={mpg}
        x="class"
        y="hwy"
        tickMedian={{ stroke: 'white', strokeWidth: 3 }} />
</Plot>
```
