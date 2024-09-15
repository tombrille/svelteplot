---
title: Custom marks
---

You can arrange custom HTML elements in the plot using the `CustomMarkHTML` mark (name subject to change)

```svelte live
<script>
    import { Plot, Dot, CustomMarkHTML } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
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
            {#snippet children({datum})}
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
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
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
