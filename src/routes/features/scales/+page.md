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
    <RuleX
        data={aapl.slice(-120)}
        x="Date"
        y1="Low"
        y2="High" />
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
    y={{ domain: [140, 200], label: '↑ Price' }}>
    <RuleX
        data={aapl.slice(-120)}
        x="Date"
        y1="Low"
        y2="High" />
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
    testid="linear" />
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
    testid="linear" />
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
        domain: [
            new Date('2021-01-01'),
            new Date('2022-01-01')
        ],
        grid: true
    }}
    marginTop={0}
    marginLeft={20}
    marginRight={20}
    height={70}
    testid="linear" />
```

```svelte
<Plot
    x={{
        domain: [
            new Date('2021-01-01'),
            new Date('2022-01-01')
        ],
        grid: true
    }} />
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
    testid="linear" />
```

```svelte
<Plot x={{ domain: [1, 1000], type: 'log', grid: true }} />
```

## Color scales

There's so much you can do with colors that we dedicated a separate page to the topic: [Color scales](/features/color-scales)!
