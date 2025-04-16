---
title: Map transform
---

```svelte live
<script>
    import { Plot, BarX, mapX } from '$lib';
</script>

<Plot y={{ type: 'band' }}>
    <BarX
        {...mapX(
            {
                data: [
                    { x: 1, v: 1 },
                    { x: 2, v: 2 },
                    { x: 3, v: -1 },
                    { x: 4, v: 4 },
                    { x: 5, v: 5 }
                ],
                x: 'v',
                y: 'x'
            },
            'cumsum'
        )} />
</Plot>
```
