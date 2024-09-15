---
title: Color scales
---

Since you're using SveltePlot for data visualization, chances are you do not want to use static colors but want to define color scales based on data! SveltePlot supports the following color scales out of the box:

## Categorical colors

Categorical color scales are useful for mapping categories to colors. The following categorical schemes are included in SveltePlot:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot color={{ legend: true }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species" />
</Plot>
```

```svelte
<Plot color={{ legend: true }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species" />
</Plot>
```

There are 11 categorical schemes included in SveltePlot, the default is `observable10`.

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { Select } from '$lib/ui';
    import { page } from '$app/stores';
    let { countries_2020 } = $derived($page.data.data);

    const schemes = [
        'accent',
        'category10',
        'dark2',
        'observable10',
        'paired',
        'pastel1',
        'pastel2',
        'set1',
        'set2',
        'set3',
        'tableau10'
    ];
    let scheme = $state('observable10');
</script>

<Select
    label="scheme"
    options={schemes}
    bind:value={scheme} />
<Plot
    grid
    color={{ legend: true, scheme }}
    y={{ type: 'log' }}
    r={{ range: [2, 14] }}>
    <Dot
        data={countries_2020}
        x="Life expectancy"
        y="GDP per capita"
        r="Population"
        fill="Continent" />
</Plot>
```

```svelte
<Plot
    grid
    y={{ type: 'log' }}
    r={{ range: [2, 14] }}
    color={{ legend: true, scheme: 'observable10' }}>
    <Dot
        data={countries_2020}
        x="Life expectancy"
        y="GDP per capita"
        r="Population"
        fill="Continent" />
</Plot>
```

You can change the default categorical color scheme using the `categoricalColorScheme` option, see [Defaults](/features/defaults)

If you want to map custom colors to your data, you need to pass them via the `schema` option.

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot
    grid
    color={{
        legend: true,
        scheme: [
            'var(--svp-red)',
            'var(--svp-blue)',
            'var(--svp-green)'
        ]
    }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species" />
</Plot>
```

```svelte
<Plot
    grid
    color={{
        legend: true,
        scheme: ['red', 'blue', 'green']
    }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species" />
</Plot>
```

Note that the colors are picked in the order the categories appear in your dataset. If you want to ensure that certain categories use certain colors, you can define the `domain` option, too:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot
    grid
    color={{
        legend: true,
        domain: ['FEMALE', 'MALE'],
        scheme: ['var(--svp-green)', 'var(--svp-violet)']
    }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="sex" />
</Plot>
```

```svelte
<Plot
    grid
    color={{
        legend: true,
        domain: ['FEMALE', 'MALE'],
        scheme: ['green', 'violet']
    }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="sex" />
</Plot>
```

## Continuous color scales

### Linear

Another very common way to color plots is to map numbers to colors. If you simply use a number column as fill or stroke, SveltePlot will default to a `linear` color scale:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid height={200} color={{ legend: true }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

The default color scheme shown above is called `turbo`, but we can change it to a number of other available schemes using the **scheme** option.

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    import { Select } from '$lib/ui';
    let { penguins } = $derived($page.data.data);

    const schemes = [
        'blues',
        'BrBg',
        'BuGn',
        'BuPu',
        'BuRd',
        'BuYlRd',
        'cividis',
        'cool',
        'cubehelix',
        'GnBu',
        'greens',
        'greys',
        'inferno',
        'magma',
        'oranges',
        'OrRd',
        'PiYG',
        'plasma',
        'PrGn',
        'PuBu',
        'PuBuGn',
        'PuOr',
        'PuRd',
        'purples',
        'rainbow',
        'RdBu',
        'RdGy',
        'RdPu',
        'RdYlBu',
        'RdYlGn',
        'reds',
        'sinebow',
        'spectral',
        'turbo',
        'viridis',
        'warm',
        'YlGn',
        'YlGnBu',
        'YlOrBr',
        'YlOrRd'
    ];

    let scheme = $state('plasma');
</script>

<Select
    label="scheme:"
    options={schemes}
    bind:value={scheme} />
<Plot
    grid
    testid="linear"
    color={{ scheme, legend: true }}
    height={200}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot color={{ scheme: 'plasma' }}>
    <Dot
        data={seattle}
        x="date"
        y="temp_max"
        stroke="temp_max" />
</Plot>
```

### Diverging

You may wonder why some of the color schemes don't use their entire range (e.g., try using the `BuYlRd` scheme above which is supposed to go from blue over yellow to red). That's because SveltePlot recognizes some schemes as `diverging` and automatically adjusts the "center" (or _pivot_) of the domain to be zero.

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot
    grid
    height={200}
    color={{ legend: true, scheme: 'BuYlRd' }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true, scheme: 'BuYlRd' }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

You can disable this by passing `type: 'linear'` to the color options:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot
    grid
    height={200}
    color={{
        legend: true,
        type: 'linear',
        scheme: 'BuYlRd'
    }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot
    grid
    color={{
        legend: true,
        type: 'linear',
        scheme: 'BuYlRd'
    }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

Alternatively you can change the center point of the diverging scale using the `pivot` option. This can be useful to highlight values above or below a certain value, like the median of a distribution.

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    import { Slider } from '$lib/ui';
    let { penguins } = $derived($page.data.data);

    let pivot = $state(4000);
</script>

<Slider
    label="pivot"
    bind:value={pivot}
    min={3000}
    max={6500} />
<Plot
    grid
    height={200}
    color={{ legend: true, pivot, scheme: 'BuYlRd' }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot
    grid
    color={{ legend: true, pivot: 1000, scheme: 'BuYlRd' }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="body_mass_g" />
</Plot>
```

### Quantile (continuous)

You can set `type: 'quantile-cont'` for a continuous quantile interpolation. Not to be confused with the discrete [quantile](#Quantile-(discrete)) scale. 

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { countries_2020 } = $derived($page.data.data);
    import { Checkbox } from '$lib/ui';

    let log = $state(true);
</script>

<Plot
    grid
    height={200}
    y={{ type: 'log' }}
    color={{
        scheme: 'OrRd',
        type: 'quantile-cont',
        legend: true
    }}>
    <Dot
        data={countries_2020}
        x="Life expectancy"
        y="Population"
        stroke="GDP per capita" />
</Plot>
```

### Logarithmic

For mapping [power-law distributions](https://en.wikipedia.org/wiki/Power_law) (like income or population) to colors, a logarithmic scale is often useful. You can switch to log scale by passing `type: 'log'` to the color options:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { countries_2020 } = $derived($page.data.data);
    import { Checkbox } from '$lib/ui';

    let log = $state(true);
</script>

<Plot
    grid
    height={200}
    y={{ type: 'log' }}
    color={{
        legend: true,
        scheme: 'OrRd',
        type: log ? 'log' : 'linear'
    }}>
    <Dot
        data={countries_2020}
        x="Life expectancy"
        y="Population"
        stroke="GDP per capita" />
</Plot>
<Checkbox label="log scale" bind:value={log} />
```

```svelte
<Plot
    grid
    color={{ legend: true, type: 'log', scheme: 'OrRd' }}
    y={{ type: 'log' }}>
    <Dot
        data={countries_2020}
        x="Life expectancy"
        y="Population"
        stroke="GDP per capita" />
</Plot>
```

### Bi-symmetric log

Like log scales but allows for negative values.

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { RadioInput } from '$lib/ui';
    import { csvFormat } from 'd3-dsv';
    import { page } from '$app/stores';
    let { symlog } = $derived($page.data.data);

    let type = $state('diverging-symlog');
</script>

<RadioInput
    options={[
        'linear',
        'diverging',
        'symlog',
        'diverging-symlog'
    ]}
    bind:value={type} />
<Plot
    color={{
        legend: true,
        scheme: 'BuYlRd',
        type: type
    }}>
    <Dot canvas data={symlog} x="x" y="y" stroke="value" />
</Plot>
```

## Discrete color scales

Discrete color scales map a continuous input domain to a discrete number of colors, controllable via the `n` option.

### Quantize

Quantize is like a "stepped" linear scale, where a continuous input domain is mapped onto a discrete number of colors . With greater `n` values, the quantize scale will look more identical to a linear scale.

```svelte live
<script>
    import { Plot, Cell, formatMonth } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/stores';
    let n = $state(5);
    let { seattle } = $derived($page.data.data);
</script>

<Slider label="n" bind:value={n} min={2} max={15} />
<Plot
    padding={0}
    aspectRatio={1}
    color={{ scheme: 'OrRd', type: 'quantize', n, legend: true, nice: true }}
    y={{
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tickFormat: formatMonth('en', 'short')
    }}
    testid="seattle-temp">
    <Cell
        data={seattle}
        filter={(d) => d.date.getUTCFullYear() === 2015}
        x={(d) => d.date.getUTCDate()}
        y={(d) => d.date.getUTCMonth()}
        fill="temp_max"
        inset="0.5" />
</Plot>
```

### Quantile (discrete)

Similiar to the `quantile` scale. Not to be confused with the continuous [quantile](#Quantile-(continuous)) scale.

```svelte live
<script>
    import { Plot, Cell, formatMonth } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/stores';
    let n = $state(5);
    let { seattle } = $derived($page.data.data);
</script>

<Slider label="n" bind:value={n} min={2} max={15} />
<Plot
    padding={0}
    aspectRatio={1}
    color={{ scheme: 'OrRd', type: 'quantile', n, legend: true }}
    y={{
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tickFormat: formatMonth('en', 'short')
    }}
    testid="seattle-temp">
    <Cell
        data={seattle}
        filter={(d) => d.date.getUTCFullYear() === 2015}
        x={(d) => d.date.getUTCDate()}
        y={(d) => d.date.getUTCMonth()}
        fill="temp_max"
        inset="0.5" />
</Plot>
```

### Threshold

Threshold scales give you absolute freedom for the breaks:

```svelte live
<script>
    import { Plot, Cell, formatMonth } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/stores';

    let domain_raw = $state('5,10,15,20,25');
    let domain = $derived(domain_raw.split(',').map(s => +s));
    
    let { seattle } = $derived($page.data.data);
</script>

<input type="text" bind:value={domain_raw} pattern="^(-?\d+(?:\.\d+)?)(,(-?\d+(?:\.\d+)?))*$" />
<Plot
    padding={0}
    aspectRatio={1}
    color={{ scheme: 'OrRd', type: 'threshold', domain, legend:true }}
    y={{
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tickFormat: formatMonth('en', 'short')
    }}
    testid="seattle-temp">
    <Cell
        data={seattle}
        filter={(d) => d.date.getUTCFullYear() === 2015}
        x={(d) => d.date.getUTCDate()}
        y={(d) => d.date.getUTCMonth()}
        fill="temp_max"
        inset="0.5" />
</Plot>
```

## Bypassing color scales

The color scales are used whenever a _fill_ or _stroke_ channel is mapped to values that do _not_ represent colors already. So in the following plot, we're **not** using a color scale, because _stroke_ is already mapped to a valid color:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" height={180}>
    <Dot
        data={seattle}
        x="date"
        y="temp_max"
        stroke="crimson" />
</Plot>
```

```svelte
<Plot>
    <Dot
        data={seattle}
        x="date"
        y="temp_max"
        stroke="crimson" />
</Plot>
```

Note that SveltePlot also recognizes generic CSS variables as valid color names, which makes it easier to theme your plots or to provide dark mode colors:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" height={180}>
    <Dot
        data={seattle}
        x="date"
        y="temp_max"
        stroke="var(--brand-red)" />
</Plot>

<style>
    :global(html) {
        --brand-red: crimson;
    }
    :global(html.dark) {
        --brand-red: hotpink;
    }
</style>
```

```svelte
<Plot height={180}>
    <Dot
        data={seattle}
        x="date"
        y="temp_max"
        stroke="var(--brand-red)" />
</Plot>

<style>
    :global(html) {
        --brand-red: crimson;
    }
    :global(html.dark) {
        --brand-red: hotpink;
    }
</style>
```

You can also force SveltePlot to bypass the color scale using `scale: null`. 

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" height={180}>
    <defs>
        <linearGradient id="gradient" y2="1" x2="0">
            <stop offset="0%" stop-color="#f7f8c8" />
            <stop offset="100%" stop-color="hotpink" />
        </linearGradient>
    </defs>
    <Dot
        data={seattle}
        x="date"
        y="temp_max"
        fill={{ scale:null, value: 'url(#gradient)' }} />
</Plot>
```

```svelte

<Plot height={180}>
    <defs>
        <linearGradient id="gradient" y2="1" x2="0">
            <stop offset="0%" stop-color="#f7f8c8" />
            <stop offset="100%" stop-color="hotpink" />
        </linearGradient>
    </defs>
    <Dot
        data={seattle}
        x="date"
        y="temp_max"
        fill={{ scale:null, value: 'url(#gradient)' }} />
</Plot>
```