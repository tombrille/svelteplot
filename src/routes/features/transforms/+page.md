---
title: Transforms
---

Transforms can be used to bring your data and channels into a shape suiting your dataset. In short, a transform is a function to which you pass the dataset, the input channels and optional transform parameters, and which returns an object with the transformed data and channel properties.

```js
function transform({ data, ...channels}, options): { data, ...channels }
```

As an example, let's take a look at the [stackY](/transforms/stack) transform. It takes a dataset and at the very least the channels `x`, `y` and -- for grouping the series -- either `fill`, `stroke`, or `z` channels.

```js
import { stackY } from 'svelteplot';

const inputData = [...];

const { data, ...channels } = stackY({
    data: inputData,
    x: 'date',
    y: 'value',
    z: 'group'
});

```

In the returned `data` array, each item will have new properties `__y1` and `__y2` which store the lower and upper offsets as calculated by the stack transform. Since we no longer want to map `y` to `value`, the `channels` now maps `y1` to `__y1` and `y2` to `__y2`

```svelte --live
<script>
    import { Plot, BarY, RuleY, stackY } from '$lib';
    import { rollups } from 'd3-array';

    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);

    let data = $derived(
        rollups(
            penguins,
            (d) => d.length,
            (d) => d.species,
            (d) => d.island
        )
            .map(([species, group]) =>
                group.map(([island, count]) => ({
                    species,
                    island,
                    count
                }))
            )
            .flat(1)
    );
</script>

<Plot grid>
    <RuleY data={[0]} />
    <BarY
        {...stackY(data, {
            x: 'island',
            y: 'count',
            fill: 'species'
        })} />
</Plot>
```

More text here

```svelte
<script>
    import { Plot, BarY, RuleY, stackY } from 'svelteplot';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid>
    <RuleY data={[0]} />
    <BarY
        {...stackY(data, {
            x: 'island',
            y: 'count',
            fill: 'species'
        })} />
</Plot>
```
