---
title: Difference mark
---

Difference

```svelte live
<script>
    import { Plot, Line, DifferenceY } from '$lib';
    import { page } from '$app/stores';
    let { gistemp } = $derived($page.data.data);
</script>

<Plot y={{ grid: true }}>
    <DifferenceY
        data={gistemp}
        x="Date"
        y="Anomaly"
        positiveFill="var(--svp-red)"
        negativeFill="var(--svp-blue)"
    />
</Plot>
```

Let's smooth

```svelte live
<script>
    import { Plot, Line, DifferenceY, windowY } from '$lib';
    import { page } from '$app/stores';
    let { gistemp } = $derived($page.data.data);
</script>

<Plot height={350} y={{ grid: true }}>
    <DifferenceY
        {...windowY({ data: gistemp, x: 'Date', y: 'Anomaly' }, { k: 14 })}
        positiveFill="var(--svp-red)"
        negativeFill="var(--svp-blue)"
    />
    <!-- <DifferenceY {...windowY({ data: 'gistemp', x: 'Date', y: 'Anomaly' }, { k: 14 })} /> -->
</Plot>
```

shiftX

```svelte live
<script>
    import { Plot, Line, DifferenceY, shiftX, RuleX } from '$lib';
    import { page } from '$app/stores';
    import { Slider } from '$lib/ui';

    let { aapl } = $derived($page.data.data);
    let days = $state(365);
</script>

<Slider label="days" min={0} max={700} bind:value={days} />
<Plot height={350} grid>
    <DifferenceY
        {...shiftX({ data: aapl, x: 'Date', y: 'Close' }, { x1: `${days} days` })} 
        positiveFill="var(--svp-green)"
        negativeFill="var(--svp-red)"
    />
</Plot>
```

```svelte
<Plot height={350} grid>
    <DifferenceY
        {...shiftX({ data: aapl, x: 'Date', y: 'Close' }, 
            { x1: `${days} days` })}
        positiveFill="green"
        negativeFill="red"
    />
</Plot>
```