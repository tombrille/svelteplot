---
title: Text mark
---

Useful for showing SVG labels!

```svelte live
<script>
    import { Plot, Dot, Text } from '$lib';
    import { getContext } from 'svelte';
    const { penguins } = getContext('data');
</script>

<Plot grid height={500} color={{ legend: true }} testid="penguins">
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" r="3" opacity={0.2} />
    <Text
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        text={(d) => d.island.charAt(0)}
    />
</Plot>
```

```svelte
<Plot grid height={500} color={{ legend: true }}>
    <Text
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        text={(d) => d.island.charAt(0)}
    />
</Plot>
```
