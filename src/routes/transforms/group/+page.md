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

<Plot x={{ tickRotate: -90 }} y={{ grid: true }} marginBottom={110}>
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

<Plot x={{ tickRotate: -90 }} margins={5} r={{ range: [0, 14] }} height={150} marginBottom={110}>
    <DotX {...groupX({ data: olympians, x: 'sport' }, { r: 'count' })} />
</Plot>
```
