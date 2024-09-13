---
title: Swoopy arrows
---

```svelte live
<script>
    import { Plot, Dot, SwoopyArrow } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot
    grid
    height={500}
    color={{ legend: true }}
    testid="penguins">
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species" />
    <SwoopyArrow
        bend="-22"
        data={[penguins[0]]}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        tx="-50"
        ty="-50" />
</Plot>
```
