---
title: Group transform
---

The **group transform** groups ordinal or nominal data — discrete values such as name, type, or category. You can then compute summary statistics for each group, such as a count, sum, or proportion. The group transform is most often used to make bar charts with the [bar mark](/marks/bar).

For example, the bar chart below shows a distribution of Olympic athletes by sport.

```svelte live
<script>
    import { Plot, BarY, RuleY, groupX } from '$lib';
    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

<Plot x={{ tickRotate: -90 }} y={{ grid: true }} height={300}>
    <BarY {...groupX({ data: olympians, x: 'sport' }, { y: 'count' })} />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot x={{ tickRotate: -90 }} y={{ grid: true }}>
    <BarY {...groupX({ data: olympians, x: 'sport' }, { y: 'count' })} />
    <RuleY data={[0]} />
</Plot>
```

The groupX transform groups on **x**. The _outputs_ argument (here `y: "count"`) declares desired output channels (**y**) and the associated reducer (_count_). Hence the height of each bar above represents the number of Olympic athletes by sport.

While the groupX transform is often used to generate **y**, it can output to any channel. For example, by declaring **r** in _outputs_, we can generate dots of size proportional to the number of athletes in each sport.

```svelte live
<script>
    import { Plot, DotX, RuleY, groupX } from '$lib';

    import { page } from '$app/stores';
    let { olympians } = $derived($page.data.data);
</script>

<Plot x={{ tickRotate: -90 }} r={{ range: [0, 14] }} height={150}>
    <DotX {...groupX({ data: olympians, x: 'sport' }, { r: 'count' })} />
</Plot>
```

```svelte
<Plot x={{ tickRotate: -90 }} r={{ range: [0, 14] }}>
    <DotX {...groupX({ data: olympians, x: 'sport' }, { r: 'count' })} />
</Plot>
```

Grouping can be combined with the implicit stack transform of the bar marks:

```svelte live
<script lang="ts">
    import { Plot, BarX, groupY, RuleX } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot x={{ axis: 'top' }} color={{ legend: true }} marginTop={40}>
    <RuleX data={[0]} />
    <BarX {...groupY({ data: penguins, y: 'island', fill: 'species' }, { x: 'count' })} />
</Plot>
```

```svelte
<Plot x={{ axis: 'top' }} color={{ legend: true }} marginTop={40}>
    <RuleX data={[0]} />
    <BarX {...groupY({ data: penguins, y: 'island', fill: 'species' }, { x: 'count' })} />
</Plot>
```

## groupX

Groups on the _x_ channel as well as an additional _z_, _fill_, or _stroke_ channel to create new groups and compute output channels (mostly _y_, but can also be used for other channels).

```js
groupX({ data, x: 'sex' }, { y: 'count' });
```

## groupY

Groups on the _y_ channel as well as an additional _z_, _fill_, or _stroke_ channel to create new groups and compute output channels (mostly _x_, but can also be used for other channels).

```js
groupY({ data, y: 'sex' }, { x: 'count' });
```

## groupZ

## group

Groups on _x_ and _y_ channels as an additional _z_, _fill_, or _stroke_ channel to create new groups and compute output channels.

```svelte live
<script>
    import { group, Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot x={{ tickRotate: -90 }} grid>
    <Dot
        {...group({ data: penguins, x: 'island', y: 'species', r: 'body_mass_g' }, { r: 'mean' })}
        fill
    />
</Plot>
```
