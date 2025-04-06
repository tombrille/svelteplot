---
title: Test filters
---

`area`:

```svelte live
<script lang="ts">
    import { Plot, AreaY } from '$lib/index';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot height={200} testid="area">
    <AreaY
        data={aapl}
        filter={(d) => d.Date.getFullYear() > 2015}
        x="Date"
        y="Close" />
</Plot>
```

`arrow`:

```svelte live
<script lang="ts">
    import { Plot, Arrow } from '$lib/index';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot
    height={300}
    testid="arrow"
    color={{ scheme: 'BuRd' }}>
    <Arrow
        data={aapl.slice(-52)}
        filter={(d) => d.Date > new Date(2018, 3, 1)}
        x1="Date"
        x2="Date"
        y1="Low"
        y2="High" />
</Plot>
```

`axis`

```svelte live
<script>
    import { Plot, AxisX, AxisY } from '$lib';
</script>

<Plot height={200} testid="axis">
    <AxisX data={[1, 2, 3, 4, 5]} filter={(d) => d != 3} />
    <AxisY data={[1, 2, 3, 4, 5]} filter={(d) => d != 3} />
</Plot>
```

`barx`

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY } from '$lib/index';
    import { page } from '$app/state';

    let { aapl } = $derived(page.data.data);
</script>

<Plot marginLeft={50} testid="barx">
    <BarX
        {...groupY(
            {
                data: aapl,
                y: (d) => d.Date.getFullYear(),
                x: 'Close'
            },
            { x: 'mean' }
        )}
        filter={(d) => d.__y !== 2016} />
</Plot>
```

`groupy`:

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY } from '$lib/index';
    import { page } from '$app/state';

    let { aapl } = $derived(page.data.data);
</script>

<Plot marginLeft={50} testid="groupy">
    <BarX
        {...groupY(
            {
                data: aapl,
                y: (d) => d.Date.getFullYear(),
                x: 'Close',
                filter: (d) => d.Date.getFullYear() !== 2016
            },
            { x: 'mean' }
        )} />
</Plot>
```

`cell`:

```svelte live
<script>
    import { Plot, Cell, formatMonth } from '$lib';
    import { page } from '$app/state';
    let { seattle } = $derived(page.data.data);
</script>

<Plot
    padding={0}
    aspectRatio={1}
    y={{
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tickFormat: formatMonth('en', 'short')
    }}
    color={{ scheme: 'blues' }}
    testid="cell">
    <Cell
        data={seattle}
        filter={(d) =>
            d.date.getUTCFullYear() === 2015 &&
            d.date.getUTCDate() < 20}
        x={(d) => d.date.getUTCDate()}
        y={(d) => d.date.getUTCMonth()}
        fill="temp_max" />
</Plot>
```

`dot`:

```svelte live
<script lang="ts">
    import { Plot, Dot } from '$lib/index';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot height={200} testid="dot">
    <Dot
        data={aapl.slice(-200)}
        filter={(d) => d.Date.getFullYear() >= 2018}
        x="Date"
        y="Close" />
</Plot>
```

`grid`:

```svelte live
<script>
    import { Plot, GridX, GridY } from '$lib';
</script>

<Plot height={200} testid="grid">
    <GridX data={[1, 2, 3, 4, 5]} filter={(d) => d != 3} />
    <GridY data={[1, 2, 3, 4, 5]} filter={(d) => d != 3} />
</Plot>
```

`line`:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib/index';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot height={200} testid="line">
    <Line
        data={aapl}
        filter={(d) => d.Date.getFullYear() > 2015}
        x="Date"
        y="Close" />
</Plot>
```

`link`:

```svelte live
<script lang="ts">
    import { Plot, Link } from '$lib/index';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot height={300} marginBottom={45} testid="link">
    <Link
        data={aapl.slice(-52)}
        filter={(d) => d.Date > new Date(2018, 3, 1)}
        x1="Date"
        x2="Date"
        y1="Low"
        y2="High" />
</Plot>
```

`rectx`:

```svelte live
<script lang="ts">
    import { Plot, RectX } from '$lib/index';
    import { page } from '$app/state';

    let { aapl } = $derived(page.data.data);
</script>

<Plot marginLeft={70} testid="rectx">
    <RectX
        data={aapl.slice(-40)}
        y="Date"
        x="Volume"
        interval="day"
        insetRight={1}
        filter={(d) => d.Date > new Date(2018, 3, 1)} />
</Plot>
```

`recty`:

```svelte live
<script lang="ts">
    import { Plot, RectY } from '$lib/index';
    import { page } from '$app/state';

    let { aapl } = $derived(page.data.data);
</script>

<Plot marginLeft={40} height={250} testid="recty">
    <RectY
        data={aapl.slice(-40)}
        x="Date"
        y="Volume"
        interval="day"
        insetRight={1}
        filter={(d) => d.Date > new Date(2018, 3, 1)} />
</Plot>
```

`rule`:

```svelte live
<script>
    import { Plot, RuleX, RuleY } from '$lib';
</script>

<Plot height={200} testid="rule">
    <RuleX data={[1, 2, 3, 4, 5]} filter={(d) => d != 3} />
    <RuleY data={[1, 2, 3, 4, 5]} filter={(d) => d != 3} />
</Plot>
```

`text`:

```svelte live
<script>
    import { Plot, Text, formatMonth } from '$lib';
    import { page } from '$app/state';
    let { seattle } = $derived(page.data.data);
</script>

<Plot
    padding={0}
    aspectRatio={1}
    inset={20}
    y={{
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tickFormat: formatMonth('en', 'short')
    }}
    color={{ scheme: 'blues' }}
    testid="text">
    <Text
        data={seattle}
        filter={(d) =>
            d.date.getUTCFullYear() === 2015 &&
            d.weather === 'fog'}
        x={(d) => d.date.getUTCDate()}
        y={(d) => d.date.getUTCMonth()}
        text="weather" />
</Plot>
```

`tickx`:

```svelte live
<script lang="ts">
    import { Plot, TickX } from '$lib/index.js';

    import { page } from '$app/state';
    let { stateage } = $derived(page.data.data);
</script>

<Plot
    testid="tickx"
    x={{ grid: true, percent: true }}
    marginLeft={50}>
    <TickX
        data={stateage}
        y="age"
        x="pop_share"
        filter={(d) =>
            d.pop_share < 0.1 || d.pop_share > 0.12} />
</Plot>
```

`ticky`:

```svelte live
<script lang="ts">
    import { Plot, TickY } from '$lib/index.js';

    import { page } from '$app/state';
    let { stateage } = $derived(page.data.data);
</script>

<Plot
    testid="ticky"
    y={{ grid: true, percent: true }}
    marginLeft={50}>
    <TickY
        data={stateage}
        x="age"
        y="pop_share"
        filter={(d) =>
            d.pop_share < 0.1 || d.pop_share > 0.12} />
</Plot>
```
