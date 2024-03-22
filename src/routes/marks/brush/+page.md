---
title: Brush mark
---

The **brush mark** is useful for interactively selecting data.

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot height={250}>
    <Line data={aapl} x="Date" y="Close" />

</Plot>
```