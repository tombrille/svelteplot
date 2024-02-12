---
title: Test
---


```svelte live
<script>
    import { Plot, BarX, RuleX } from '$lib';
</script>

<Plot y={{ type: 'band' }} opacity={{ range: [0.2, 1]}} height={200} marginTop={0}>
    <!-- <BarX data={[2.3, 4, 5, 3.7, 5.4]} opacity={0.3}  /> -->
    <BarX data={[1, 2, 3, 4, 5]} inset={8} fillOpacity={d => d} />
</Plot>
```

