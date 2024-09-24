---
title: Server-side rendering
---

Test

```svelte live
<script>
    import { Plot, AxisX, BarX } from '$lib';
</script>
<Plot height={130} grid title="SSR Test" x={{ domain: [0,4]}}  y={{ domain: [3,2,1,0], type: 'band' }}>
    <AxisX data={[0,1,2,3,4]} />
    <BarX data={[1,2,3,4]} />
</Plot>
```