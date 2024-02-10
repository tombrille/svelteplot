---
title: Interactivity
---

Svelte makes interactive plots a lot easier!

Click the bar chart!

```svelte live
<script>
    import { Plot, RuleY, BarY } from '$lib';

    let clicked = $state();

    let title = $derived(clicked ? `You clicked ${JSON.stringify(clicked)}` : 'Click the bars');
</script>

<Plot x={{ type: 'band', axis: false }} y={{ grid: true }} {title}>
    <BarY
        data={[-2, -1, 2, 4, 6, 9, 5]}
        fill="currentColor"
        opacity={(d) => (!clicked || clicked === d ? 1 : 0.5)}
        onclick={(d) => (clicked = d)}
    />
    <RuleY data={[0]} />
</Plot>
```

## Tooltips

You can use the [HTMLTooltip](/marks/tooltip) mark to show custom HTML tooltips in your plot.

```svelte live
<script>
    import { getContext } from 'svelte';
    import { Plot, Dot, HTMLTooltip } from '$lib';

    const getData = getContext('data');
    let { penguins } = $derived(getData());

    const speciesImages = {
        Adelie: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg/346px-Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg',
        Chinstrap:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg/201px-A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg',
        Gentoo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/00_0304_Gentoo_Penguins.jpg/160px-00_0304_Gentoo_Penguins.jpg'
    };
</script>

<Plot grid height={500} symbol={{ legend: true }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species"
    />
    {#snippet overlay()}
        <HTMLTooltip data={penguins} let:datum x="culmen_length_mm" y="culmen_depth_mm">
            <div class="tt">
                <div>Species: {datum.species}</div>
                <div>Island: {datum.island}</div>
                <div>
                    <img src={speciesImages[datum.species]} />
                </div>
            </div>
        </HTMLTooltip>
    {/snippet}
</Plot>

<style>
    .tt {
        display: flex;
        gap: 5px;
        flex-direction: column;
    }
    img {
        max-width: 120px;
    }
</style>
```

You can even put another tiny plot inside the HTML tooltips:

```svelte live
<script>
    import { getContext } from 'svelte';
    import { Plot, Dot, HTMLTooltip, BarX } from '$lib';
    import isEqual from 'underscore/modules/isEqual.js';

    const getData = getContext('data');
    let { penguins } = $derived(getData());

    const speciesImages = {
        Adelie: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg/346px-Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg',
        Chinstrap:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg/201px-A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg',
        Gentoo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/00_0304_Gentoo_Penguins.jpg/160px-00_0304_Gentoo_Penguins.jpg'
    };
</script>

<Plot grid height={500}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species"
    />
    {#snippet overlay()}
        <HTMLTooltip data={penguins} let:datum x="culmen_length_mm" y="culmen_depth_mm">
            <div style="width: 150px">
                <Plot
                    inset={4}
                    margins={0}
                    x={{ label: null, axis: false }}
                    y={{ label: null, axis: false }}
                    height={130}
                >
                    <Dot
                        data={penguins}
                        x="culmen_length_mm"
                        y="culmen_depth_mm"
                        stroke="species"
                        r={2}
                        opacity={0.2}
                    />
                    <Dot
                        data={[datum]}
                        x="culmen_length_mm"
                        y="culmen_depth_mm"
                        r={4}
                        fill="currentColor"
                    />
                </Plot>
            </div>
        </HTMLTooltip>
    {/snippet}
</Plot>

<style>
    .tt {
        display: flex;
        gap: 5px;
        flex-direction: column;
    }
    img {
        max-width: 120px;
    }
</style>
```
