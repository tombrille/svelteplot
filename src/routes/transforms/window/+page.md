---
title: Window transform
---

```svelte live
<script>
    import { Plot, AreaY, Line, windowY } from '$lib';
    import { Slider, Select } from '$lib/ui';
    import { page } from '$app/stores';

    let { sftemp } = $derived($page.data.data);
    let k = $state(20);
    let reduce = $state('mean');
    let anchor = $state('middle');
    let strict = $state(false);

    let niceReduce = $derived(
        {
            min: 'minimum',
            max: 'maximum',
            mean: 'average',
            p01: '1-percentile',
            p25: '25-percentile',
            p75: '75-percentile',
            p99: '99-percentile'
        }[reduce] || reduce
    );

    const REDUCE_OPTIONS = [
        'mean',
        'median',
        // 'mode',
        'p01',
        'p25',
        'p75',
        'p99',
        'min',
        'max'
        // 'deviation',
        // 'variance',
        // 'ratio',
        // 'difference'
    ].sort();
</script>

<p>
    For example, the band chart below shows the daily high and low temperature in San Francisco. The <span
        style="border-bottom: solid 2px var(--svp-red);">red</span
    >
    line represents the {k}-day {niceReduce} high, and the
    <span style="border-bottom: solid 2px var(--svp-blue);">blue</span>
    line the {k}-day {niceReduce} low.
</p>

<Slider label="k" min={1} max={100} bind:value={k} />
<Select label="reduce" options={REDUCE_OPTIONS} bind:value={reduce} />
<Select label="anchor" options={['start', 'middle', 'end']} bind:value={anchor} />
<label><input type="checkbox" bind:checked={strict} /> strict</label>
<Plot inset={5}>
    <AreaY data={sftemp} x="date" y1="low" y2="high" opacity="0.2" />
    <Line
        {...windowY({ data: sftemp, x: 'date', y: 'low' }, { k, anchor, strict, reduce })}
        stroke="var(--svp-blue)"
    />
    <Line
        {...windowY({ data: sftemp, x: 'date', y: 'high' }, { k, anchor, strict, reduce })}
        stroke="var(--svp-red)"
    />
    <AreaY
        {...windowY(
            { data: sftemp, x: 'date', y1: 'high', y2: 'low' },
            { k, anchor, strict, reduce }
        )}
        fillOpacity={0.15}
        fill="yellow"
        mixBlendMode="multiply"
    />
</Plot>
```

```svelte
<Plot>
    <!-- raw data -->
    <AreaY data={sftemp} x="date" y1="low" y2="high" opacity="0.2" />
    <!-- line for reduced high temp. -->
    <Line
        {...windowY({ data: sftemp, x: 'date', y: 'low' }, { k, anchor, strict, reduce })}
        stroke="blue"
    />
    <!-- line for reduced low temp. -->
    <Line
        {...windowY({ data: sftemp, x: 'date', y: 'high' }, { k, anchor, strict, reduce })}
        stroke="red"
    />
    <!-- area band between reduced high and low temp. -->
    <AreaY
        {...windowY(
            { data: sftemp, x: 'date', y1: 'high', y2: 'low' },
            { k, anchor, strict, reduce }
        )}
        fillOpacity={0.25}
        fill="yellow"
        mixBlendMode="multiply"
    />
</Plot>
```

As you see above, the windowY transform will automatically transform any channel of y, y1, and y2 that is defined, so you can use it for area marks as well.

Note that the window transform is series-aware (it groups by z/fill/stroke before computing the windows)

```svelte live
<script>
    import { Plot, AreaY, RectX, Line, windowY, binX, groupZ, Text, last } from '$lib';
    import { page } from '$app/stores';
    import { Slider } from '$lib/ui';
    import { groups } from 'd3-array';

    let { stocks } = $derived($page.data.data);
    let stocks2 = $derived(stocks.filter((d) => d.Date.getFullYear() < 2016));
    let k = $state(90);
    let smoothed = $derived(windowY({ data: stocks, x: 'Date', y: 'Close', z: 'Symbol' }, { k }));
</script>

<Slider label="k" min={1} max={120} bind:value={k} />
<Plot grid y={{ type: 'log', base: 5 }} marginRight={75}>
    <RectX
        {...binX(
            { data: stocks, x: 'Date', y1: 'Low', y2: 'High', fill: 'Symbol' },
            { y1: 'min', y2: 'max', interval: '2 weeks' }
        )}
        opacity="0.4"
        strokeWidth="1.5"
    />
    <Line {...smoothed} stroke="Symbol" strokeWidth="2" markerEnd="dot" />
    <Text {...last(smoothed)} fill="Symbol" text="Symbol" dx="10" textAnchor="start" />
</Plot>
```

```svelte
<script>
    let smoothed = $derived(windowY({ data: stocks2, x: 'Date', y: 'Close', z: 'Symbol' }, { k }));
</script>

<Plot grid y={{ type: 'log', base: 5, domain: [50, 1000] }} marginRight={100}>
    <RuleX
        {...binX(
            { data: stocks2, x: 'Date', y1: 'Low', y2: 'High', z: 'Symbol' },
            { y1: 'min', y2: 'max', interval: '3 days' }
        )}
        opacity="0.5"
        strokeWidth="1.5"
    />
    <Line {...smoothed} stroke="Symbol" strokeWidth="2" markerEnd="dot" />
    <Text {...last(smoothed)} fill="Symbol" text="Symbol" dx="10" textAnchor="start" />
</Plot>
```

## WindowX

## WindowY
