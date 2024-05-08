---
title: Box mark
---

Box marks are a compound mark consisting of a bar, rule, dots and tick marks (see options)

## Options

You can style box plots by passing separate options for the marks

- **bar** - options passed to the inter-quartile range bar marks
- **rule** - options passed to the min/max range rule marks
- **dot** - options passed to the dot marks representing the outliers
- **tickMedian** - options passed to the tick marks representing the median
- **tickMinMax** - options passed to the tick marks representing the lower and upper quartiles

## BoxX

```svelte live
<script>
    import { Plot, BoxX } from '$lib';
    import { page } from '$app/stores';
    let { mpg } = $derived($page.data.data);
</script>

<Plot x={{ grid: true }}>
    <BoxX data={mpg} x="hwy" tickMinMax y="class" 
        dot={{ fill: true }}
        bar={{ fill: 'white', stroke: 'currentColor' }}/>
</Plot>
```

```svelte
<Plot x={{ grid: true }}>
    <BoxX data={mpg} x="hwy" tickMinMax y="class" 
        dot={{ fill: true }}
        bar={{ fill: 'white', stroke: 'currentColor' }}/>
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
    <BoxY data={mpg} x="class" y="hwy" tickMedian={{ stroke: 'white', strokeWidth: 3 }} />
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