---
title: Custom marks
---

## CustomMark

```svelte live
<script>
    import { Plot, Dot, CustomMark } from '$lib';
    import Spiral from '$lib/ui/Spiral.svelte';
    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
</script>

<Plot
    grid
    height={400}
    x={{ domain: [30, 62] }}
    y={{ domain: [13, 21.9] }}>
    <defs>
        <symbol
            id="spiral"
            width="24"
            height="24"
            viewBox="-12 -12 24 24">
            <Spiral
                stroke="var(--svp-red)"
                finalRadius={10}
                duration={4} />
        </symbol>
    </defs>
    <CustomMark
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm">
        {#snippet children({ datum })}
            <use href="#spiral" x="-12" y="-12" />
        {/snippet}
    </CustomMark>
</Plot>
```

```svelte
<Plot
    grid
    height={400}
    x={{ domain: [31, 62] }}
    y={{ domain: [13, 21.9] }}>
    <CustomMark
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm">
        {#snippet children({ datum })}
            <!-- Spiral is your own component -->
            <Spiral stroke="red" />
        {/snippet}
    </CustomMark>
</Plot>
```

## CustomMarkHTML

You can arrange custom HTML elements in the plot using the `CustomMarkHTML` mark (name subject to change)

```svelte live
<script>
    import { Plot, Dot, CustomMarkHTML } from '$lib';
    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
</script>

<Plot grid>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species" />
    {#snippet overlay()}
        <CustomMarkHTML
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm">
            {#snippet children({ datum })}
                <div
                    style="width:80px;height: 2em;position:absolute;top:-1em;left:-40px; text-align:center">
                    {datum.species}
                </div>
            {/snippet}
        </CustomMarkHTML>
    {/snippet}
</Plot>
```

```svelte
<Plot grid>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species" />
    {#snippet overlay()}
        <CustomMarkHTML
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm">
            {#snippet children({ datum })}
                <div
                    style="width:80px;height: 2em;position:absolute;top:-1em;left:-40px; text-align:center">
                    {datum.species}
                </div>
            {/snippet}
        </CustomMarkHTML>
    {/snippet}
</Plot>
```

```svelte live
<script>
    import { Plot, Dot, CustomMarkHTML } from '$lib';
    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
    import { sampleSize } from 'es-toolkit';

    let data = $derived(
        sampleSize(penguins, 5).map((d, i) => ({
            ...d,
            i: i,
            dx: [50, -30, 60, 20, 0][i],
            dy: [-40, 30, 20, 0, 40][i],
            width: 100,
            height: 50,
            anchor: 'tl'
        }))
    );
</script>

<Plot grid inset={40}>
    <Dot
        {data}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species" />
    {#snippet overlay()}
        <CustomMarkHTML
            {data}
            x="culmen_length_mm"
            y="culmen_depth_mm">
            {#snippet children({ datum })}
                <div
                    style:width="{datum.width}px"
                    style:height="{datum.height}px"
                    style:background="#ffffff99"
                    style:border="1px solid #ccc"
                    style="position:absolute"
                    style:top="{datum.dy < 0
                        ? -datum.heigh + datum.dy
                        : datum.dy > 0
                          ? datum.dy
                          : -datum.height * 0.5}px"
                    style:left="-40px">
                    {datum.i}: {datum.species}
                    {datum.dy}
                </div>
            {/snippet}
        </CustomMarkHTML>
    {/snippet}
</Plot>
```

### Options

- data
- x
- y
- frameAnchor (see [Text](/marks/text) mark)

## mapXY

Another way to use custom marks is to position them yourself using the `mapXY` method:

```svelte live
<script>
    import { Plot, Dot, CustomMarkHTML } from '$lib';

    const data = [
        { val1: 8, val2: -8 },
        { val1: 2, val2: 8 },
        { val1: 5, val2: -6 },
        { val1: 7, val2: 4 }
    ];
</script>

<Plot
    height={300}
    grid
    x={{ domain: [0, 10] }}
    y={{ domain: [-20, 20] }}
    inset={40}>
    {#snippet children({ mapXY })}
        {#each data as { val1, val2 }}
            {@const { x, y } = mapXY(val1, val2)}
            <g transform="translate({x},{y})">
                <circle r={9} opacity={0.4} fill="red" />
            </g>
        {/each}
    {/snippet}
</Plot>
```

```svelte
<Plot
    height={300}
    grid
    x={{ domain: [0, 10] }}
    y={{ domain: [-20, 20] }}
    inset={40}>
    {#snippet children({ mapXY })}
        {#each data as { val1, val2 }}
            {@const { x, y } = mapXY(val1, val2)}
            <g transform="translate({x},{y})">
                <circle r={9} opacity={0.4} fill="red" />
            </g>
        {/each}
    {/snippet}
</Plot>
```
