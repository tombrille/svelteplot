---
title: Scales
---

A core feature of SveltePlot is automatically inferred scale types and domains based on the data that is mapped to mark channels bound to each scale.

In the example below, we have a line mark with the x channel to `"Date"` and y channel mapped to `"Close"`, which are keys of the data objects in the `aapl` array.

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

The x channel is bound to the _x_ scale, (other marks may also bind channels like x1 or x2 to the same scale). To figure out the scale type, SveltePlot looks at all data values mapped to the x scale. In this case, they are all Date objects, so it infers a _time_ scale. The scale domain is automatically set to the extent of all data values.

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="aapl-line-frame" height={250}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

Since there's just one explicit mark in the plot and the channels are mapped to property names, SveltePlot will use them as axis titles automatically. In the next example we have a [RuleX](/marks/rule#RuleX) mark which maps two channels to the y scale.

```svelte
<Plot grid>
    <RuleX data={aapl} x="Date" y1="Low" y2="High" />
</Plot>
```

Since we no longer have a single key, the y axis title is left empty.

```svelte live
<script>
    import { Plot, RuleX } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="aapl-line-frame" inset={5} height={250}>
    <RuleX data={aapl.slice(-120)} x="Date" y1="Low" y2="High" />
</Plot>
```

You can set a custom axis title or domain by providing global scale options:

```svelte
<Plot grid y={{ domain: [140, 200], label: '↑ Price' }}>
    <RuleX data={aapl} x="Date" y1="Low" y2="High" />
</Plot>
```

```svelte live
<script>
    import { Plot, RuleX } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot
    testid="aapl-line-frame"
    inset={5}
    height={250}
    grid
    y={{ domain: [140, 200], label: '↑ Price' }}
>
    <RuleX data={aapl.slice(-120)} x="Date" y1="Low" y2="High" />
</Plot>
```

SveltePlot tries to automatically detect whether or not to map certain channels to scales, but you can also fine-tune this behavior.

For the positional channels such as x, x1, or y, Plot assumes that you'll always want to map the values to a scale, no matter how they're specified.

SveltePlot will also automatically infer scale domains from the data you mapped to channels that are bound to each scale. You can also set a custom domain using the scale options.

## Continuous scales

The domain of a quantitative scale is a continuous extent [min, max] where min and max are
numbers, such as temperatures. Below, the first domain value (x = 0) corresponds to the left
side of the plot while the second (x = 100) corresponds to the right side.

```svelte live
<script>
    import { Plot, GridX, GridY, Line } from '$lib';
</script>

<Plot
    x={{ domain: [0, 100], grid: true }}
    marginTop={0}
    marginLeft={10}
    marginRight={10}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [0, 100], grid: true }} />
```

Scales can be reversed using the **reverse** option:

```svelte live
<script>
    import { Plot, GridX, GridY, Line } from '$lib';
</script>

<Plot
    x={{ domain: [0, 100], grid: true, reverse: true }}
    marginTop={0}
    marginLeft={10}
    marginRight={10}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [0, 100], grid: true, reverse: true }} />
```

If the domain is dates, SveltePlot will default to a UTC scale. This is a linear scale with ticks
based on the Gregorian calendar.

```svelte live
<script>
    import { Plot, GridX, GridY, Line } from '$lib';
</script>

<Plot
    x={{
        type: 'time',
        domain: [new Date('2021-01-01'), new Date('2022-01-01')],
        grid: true
    }}
    marginTop={0}
    marginLeft={20}
    marginRight={20}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [new Date('2021-01-01'), new Date('2022-01-01')], grid: true }} />
```

## Logarithmic scales

SveltePlot will automatically detect a scale type, but you can also set it explicitly using the **type** scale option:

```svelte live
<script>
    import { Plot, GridX, GridY, Line } from '$lib';
</script>

<Plot
    x={{ domain: [1, 1000], type: 'log', grid: true }}
    marginTop={0}
    marginLeft={10}
    marginRight={20}
    height={70}
    testid="linear"
/>
```

```svelte
<Plot x={{ domain: [1, 1000], type: 'log', grid: true }} />
```

## Color scales

SveltePlot comes with a range of ready-to-use color scales for various purposes. The color scales are used whenever a _fill_ or _stroke_ channel is mapped to values that do _not_ represent colors already. So in the following plot, we're **not** using a color scale, because _stroke_ is already mapped to a valid color:

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

### Qualitative color scales

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

### Qualitative color scales

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
