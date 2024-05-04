---
title: Box mark
---

For box plots.

## BoxX

```svelte live
<script>
    import { Plot, BoxX } from '$lib';
    import { page } from '$app/stores';
    let { mpg } = $derived($page.data.data);
</script>

<Plot grid>
    <BoxX data={mpg} x="hwy"  y="class" />
</Plot>
```

## BoxY

```svelte live
<script>
    import { Plot, BoxY } from '$lib';
    import { page } from '$app/stores';
    let { mpg } = $derived($page.data.data);
</script>

<Plot grid>
    <BoxY data={mpg} x="class" y="hwy" />
</Plot>
```