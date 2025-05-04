---
title: Bar mark
---

<script>
    import BarPlot from './BarPlot.svelte';
    import StackedBarPlot from './StackedBarPlot.svelte';
</script>

Bars are cool. They come in two flavors: [BarY](#BarY) for vertical bars (columns) and [BarX](#BarX) for horizontal bars.

Here's a very simple bar chart:

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib';
</script>

<Plot
    y={{ type: 'band' }}
    x={{ grid: true }}
    height={200}
    marginTop={0}>
    <BarX data={[1, 2, 3, 4, 5]} />
    <RuleX data={[0]} />
</Plot>
```

```svelte
<Plot y={{ type: 'band' }} x={{ grid: true }} height={120}>
    <BarX data={[1, 2, 3, 4, 5]} />
    <RuleX data={[0]} />
</Plot>
```

You can create stacked bar charts by defining a fill channel which will be used for grouping the series by the implicit [stack transform](/transforms/stack):

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY, RuleX } from '$lib';
    import { getContext } from 'svelte';

    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
</script>

<Plot
    x={{ axis: 'top' }}
    color={{ legend: true }}
    marginTop={40}>
    <RuleX data={[0]} />
    <BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} />
</Plot>
```

```svelte
<Plot
    x={{ axis: 'top' }}
    color={{ legend: true }}>
    <RuleX data={[0]} />
    <BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} />
</Plot>
```
[fork](https://svelte.dev/playground/6d334e103f9e444d99bb67c8af1335bc?version=5.28.2)



## BarX

The `BarX` component renders horizontal bars, typically used with a band scale on the y-axis. This is ideal for categorical data where the categories run along the y-axis, and the values extend horizontally.

### Properties

- **data** - The data array to visualize
- **x** - Value accessor for the x channel (length of bar)
- **x1** - Start value accessor for the x channel
- **x2** - End value accessor for the x channel
- **y** - Value accessor for the y channel (position on the category axis)
- **stack** - Configuration for stacking the bars. See [stack transform](/transforms/stack)
- **borderRadius** - Border radius for the bar corners. Can be a single number for all corners or an object with separate values for topLeft, topRight, bottomRight, bottomLeft
- **inset** - Inset value for all sides of the bar
- **insetLeft** - Inset value for the left side of the bar
- **insetRight** - Inset value for the right side of the bar
- **insetTop** - Inset value for the top of the bar
- **insetBottom** - Inset value for the bottom of the bar

Additionally, `BarX` supports all common styling properties like `fill`, `stroke`, `opacity`, etc.

### Example

```svelte
<Plot y={{ type: 'band' }} x={{ grid: true }}>
  <BarX 
    data={myData} 
    y="category"  
    x="value" 
    fill="steelblue" 
  />
</Plot>
```

For stacked bar charts, provide a `fill` channel that will be used for grouping the series:

```svelte
<Plot y={{ type: 'band' }} color={{ legend: true }}>
  <BarX 
    data={myData} 
    y="category"
    x="value"
    fill="group" 
  />
</Plot>
```

## BarY

The `BarY` component renders vertical bars (columns), typically used with a band scale on the x-axis. This is ideal for categorical data where the categories run along the x-axis, and the values extend vertically.

### Properties

- **data** - The data array to visualize
- **x** - Value accessor for the x channel (position on the category axis)
- **y** - Value accessor for the y channel (height of bar)
- **y1** - Start value accessor for the y channel
- **y2** - End value accessor for the y channel
- **stack** - Configuration for stacking the bars. See [stack transform](/transforms/stack)
- **interval** - Converts y into y1/y2 ranges based on the provided interval. Disables implicit stacking
- **borderRadius** - Border radius for the bar corners. Can be a single number for all corners or an object with separate values for topLeft, topRight, bottomRight, bottomLeft
- **inset** - Inset value for all sides of the bar
- **insetLeft** - Inset value for the left side of the bar
- **insetRight** - Inset value for the right side of the bar
- **insetTop** - Inset value for the top of the bar
- **insetBottom** - Inset value for the bottom of the bar

Additionally, `BarY` supports all common styling properties like `fill`, `stroke`, `opacity`, etc.

### Example

```svelte
<Plot x={{ type: 'band' }} y={{ grid: true }}>
  <BarY 
    data={myData} 
    x="category"  
    y="value" 
    fill="steelblue" 
  />
</Plot>
```

For stacked bar charts, provide a `fill` channel that will be used for grouping the series:

```svelte
<Plot x={{ type: 'band' }} color={{ legend: true }}>
  <BarY 
    data={myData} 
    x="category"
    y="value"
    fill="group" 
  />
</Plot>
```

## Insets



You can create bullet bars using the `inset` option and two `BarX` layers:

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib';
</script>

<Plot y={{ type: 'band' }} height={200} marginTop={0}>
    <BarX data={[2.3, 4, 5, 3.7, 5.4]} opacity={0.3} />
    <BarX data={[1, 2, 3, 4, 5]} inset={8} />
</Plot>
```

```svelte
<Plot y={{ type: 'band' }} height={200} marginTop={0}>
    <BarX data={[2.3, 4, 5, 3.7, 5.4]} opacity={0.3} />
    <BarX data={[1, 2, 3, 4, 5]} inset={8} />
</Plot>
```

[fork](https://svelte.dev/playground/d8170543f02c482ba64e82787d716e40?version=5.28.2)

Note that **inset** by default only applies along the band scale axis, but won't affect the "length" the bars. You can use insetLeft, insetRight, insetTop, and insetBottom directly, e.g. to add space in a stacked bar chart:

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY, RuleX } from '$lib';
    import { getContext } from 'svelte';

    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
</script>

<Plot
    x={{ axis: 'top' }}>
    <RuleX data={[0]} />
    <BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} 
        insetRight={1} />
</Plot>
```

```svelte
<BarX
        {...groupY(
            {
                data: penguins,
                y: 'island',
                fill: 'species'
            },
            { x: 'count' }
        )} 
        insetRight={1} />
```

[fork](https://svelte.dev/playground/6f5f4ae882e24f5b81c60842c6250f31?version=5.28.2)

:::caution
Please be aware that by setting insets, you are slightly distorting the area of the bars.
:::

## Border radius

You can set a border radius for the bars either as number for all corners or as `{'{ topLeft, topRight, bottomRight, bottomLeft }'}` object to specify a border radius for individual corners:.

:::caution
Please be aware that by setting a border radius, you are slightly distorting the area of the bars.
:::

```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib';
    import { Slider } from '$lib/ui';

    let radius = $state(10);
</script>

<Slider
    bind:value={radius}
    min={0}
    max={20}
    label="radius" />
<Plot x={{ axis: false }} y={{ type: 'band', axis: false }}>
    <BarX
        data={[1, 2, 3, 4, 5]}
        borderRadius={{
            topRight: radius,
            bottomRight: radius
        }} />
    <RuleX data={[0]} />
</Plot>
```

```svelte
<Plot x={{ axis: false }} y={{ type: 'band', axis: false }}>
    <BarX
        data={[1, 2, 3, 4, 5]}
        borderRadius={{ topRight: 10, bottomRight: 10 }} />
    <RuleX data={[0]} />
</Plot>
```
