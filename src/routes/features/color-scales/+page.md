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
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
</Plot>
```

```svelte
<Plot color={{ legend: true }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
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

<Select label="scheme" options={schemes} bind:value={scheme} />
<Plot grid color={{ legend: true, scheme }} y={{ type: 'log' }} r={{ range: [2, 14] }}>
    <Dot
        data={countries_2020}
        x="Life expectancy"
        y="GDP per capita"
        r="Population"
        fill="Continent"
    />
</Plot>
```

```svelte
<Plot
    grid
    y={{ type: 'log' }}
    r={{ range: [2, 14] }}
    color={{ legend: true, scheme: 'observable10' }}
>
    <Dot
        data={countries_2020}
        x="Life expectancy"
        y="GDP per capita"
        r="Population"
        fill="Continent"
    />
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
    color={{ legend: true, scheme: ['var(--svp-red)', 'var(--svp-blue)', 'var(--svp-green)'] }}
>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true, scheme: ['red', 'blue', 'green'] }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
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
    }}
>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="sex" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true, domain: ['FEMALE', 'MALE'], scheme: ['green', 'violet'] }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="sex" />
</Plot>
```

## Sequential color scales

Another very common way to color plots is to map numbers to colors. If you simply use a number column as fill or stroke, SveltePlot will default to a `linear` color scale:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid height={200} color={{ legend: true }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
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

<Select label="scheme:" options={schemes} bind:value={scheme} />
<Plot grid testid="linear" color={{ scheme, legend: true }} height={200}>
<Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot color={{ scheme: 'plasma' }}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
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

<Plot grid height={200} color={{ legend: true, scheme: 'BuYlRd'  }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true, scheme: 'BuYlRd' }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
</Plot>
```

You can disable this by passing `type: 'linear'` to the color options:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid height={200} color={{ legend: true, type: 'linear', scheme: 'BuYlRd'  }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true,  type: 'linear', scheme: 'BuYlRd' }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
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

<Slider label="pivot" bind:value={pivot} min={3000} max={6500} />
<Plot grid height={200} color={{ legend: true, pivot, scheme: 'BuYlRd'  }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
</Plot>
```

```svelte
<Plot grid color={{ legend: true,  pivot: 1000, scheme: 'BuYlRd' }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="body_mass_g" />
</Plot>
```
    

## Ordinal color scales

## Bypassing color scales

The color scales are used whenever a _fill_ or _stroke_ channel is mapped to values that do _not_ represent colors already. So in the following plot, we're **not** using a color scale, because _stroke_ is already mapped to a valid color:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="crimson" />
</Plot>
```

```svelte
<Plot>
    <Dot data={seattle} x="date" y="temp_max" stroke="crimson" />
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
    <Dot data={seattle} x="date" y="temp_max" stroke="var(--brand-red)" />
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
    <Dot data={seattle} x="date" y="temp_max" stroke="var(--brand-red)" />
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

## Qualitative color scales

If we change the stroke to `"weather"`, which is an attribute of our dataset rows, the color scale is used. Since the values are strings, SveltePlot defaults to a qualitative color scale. We can specify the _legend_ option of the color scale to show the color legend:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" color={{ legend: true }} height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="weather" />
</Plot>
```

```svelte
<Plot color={{ legend: true }}>
    <Dot data={seattle} x="date" y="temp_max" stroke="weather" />
</Plot>
```

The default color scheme shown above is called `observable10`, but we can change it to a number of other available schemes using the **scheme** option.

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    import { Select } from '$lib/ui';
    let { seattle } = $derived($page.data.data);

    const schemes = [
        'accent',
        'category10',
        'dark2',
        'paired',
        'pastel1',
        'pastel2',
        'set1',
        'set2',
        'set3',
        'tableau10',
        'observable10'
    ];

    let scheme = $state('tableau10');
</script>

<Select label="scheme:" options={schemes} bind:value={scheme} />
<Plot testid="linear" color={{ legend: true, scheme }} height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="weather" />
</Plot>
```

We can also pass our own array of colors via the **scheme** option. Combined with providing a custom domain we can ensure that the categories map to the exact color we want:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot
    testid="linear"
    color={{
        legend: true,
        scheme: ['orange', 'lightsteelblue', 'lightseagreen', 'deepskyblue', 'gray'],
        domain: ['sun', 'drizzle', 'rain', 'snow', 'fog']
    }}
    height={180}
>
    <Dot data={seattle} x="date" y="temp_max" stroke="weather" />
</Plot>
```

```svelte
<Plot
    color={{
        legend: true,
        domain: ['sun', 'drizzle', 'rain', 'snow', 'fog'],
        scheme: ['orange', 'lightsteelblue', 'lightseagreen', 'deepskyblue', 'gray']
    }}
>
    <Dot data={seattle} x="date" y="temp_max" stroke="weather" />
</Plot>
```

### Quantitative color scales

Now, let's see how it looks if map the stroke channel to a numeric attribute of our dataset rows, e.g., `"temp_max"` (which we're also using for the y position channel). Now SveltePlot is using a quantitative color scale.

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" color={{ legend: true }} height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

```svelte
<Plot color={{ legend: true }}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

The default color scheme shown above is called `turbo`, but we can change it to a number of other available schemes using the **scheme** option.

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    import { Select } from '$lib/ui';
    let { seattle } = $derived($page.data.data);

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

<Select label="scheme:" options={schemes} bind:value={scheme} />
<Plot grid testid="linear" color={{ scheme }} height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

```svelte
<Plot color={{ scheme: 'BuRd' }}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

You may wonder why some of the color schemes don't use their entire range (e.g., try using the `BuYlRd` scheme above which is supposed to go from blue over yellow to red). That's because SveltePlot recognizes some schemes as _diverging_ and automatically adjusts the "center" (or _pivot_) of the domain to be zero.

So in the plot above, the temperatures shown range from something like -2 to 38 degrees, but the color scale domain will range from _[-38, 0, 38]_ to ensure that the yellow center is at zero. You can change that by setting the **pivot** option:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    import { Slider } from '$lib/ui';
    let { seattle } = $derived($page.data.data);

    let pivot = $state(10);
</script>

<Slider label="pivot" min={-1} max={38} bind:value={pivot} />
<Plot testid="linear" color={{ scheme: 'BuYlRd', pivot }} height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

```svelte
<Plot color={{ scheme: 'BuYlRd', pivot: 15 }}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

Alternatively you can also override the scale type to `"linear"` to have the colors spread out evenly across the domain:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" color={{ scheme: 'BuYlRd', type: 'linear' }} height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

```svelte
<Plot color={{ scheme: 'BuYlRd', type: 'linear' }}>
    <Dot data={seattle} x="date" y="temp_max" stroke="temp_max" />
</Plot>
```

If you want you can also pass a custom scheme, either as **interpolate** option (taking a function that takes a value between _[0,1]_ as input and returns a color), or as convenient array of color strings:

```svelte live
<script>
    import { Plot, GridX, GridY, Dot } from '$lib';
    import { page } from '$app/stores';
    let { seattle } = $derived($page.data.data);
</script>

<Plot testid="linear" color={{ scheme: ['pink', 'crimson'] }} height={180}>
    <Dot data={seattle} x="date" y="temp_max" stroke="date" />
</Plot>
```

```svelte
<Plot color={{ scheme: ['pink', 'crimson'] }}>
    <Dot data={seattle} x="date" y="temp_max" stroke="date" />
</Plot>
```
