---
title: Bollinger mark
---

```svelte live
<script lang="ts">
    import { Plot, Line, Area, BollingerY } from '$lib';
    import type { Datasets } from '$lib/types.js';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <BollingerY data={aapl} x="Date" y="Adj Close" stroke="red" />
</Plot>
```
