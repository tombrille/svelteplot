---
title: Test
---

This is a page with a single chart or easier debugging.

```svelte live
<script>
    import { Plot, BarX } from '$lib/index';
</script>

<Plot grid testid="simple-bars">
    <BarX data={[1, 2, 3, 4]} />
</Plot>
```