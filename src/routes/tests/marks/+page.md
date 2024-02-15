---
title: Test
---

```svelte live
<script>
    import { Plot, Dot, RegressionY } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid height={500} color={{ legend: true }} testid="penguins">
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" fill="species" />
    <RegressionY data={penguins} x="culmen_length_mm" y="culmen_depth_mm" />
    <RegressionY data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
</Plot>
```
