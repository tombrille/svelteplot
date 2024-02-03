---
title: Test
---

This is a page with a single chart or easier debugging.

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot debug grid x={{ interval: '1 week', domain: [new Date(2000, 0, 1), new Date(2000, 2, 1)] }} />
```
