---
title: Stack transform
---

```svelte live
<script lang="ts">
    import { getContext } from 'svelte';
    import { Plot, Area, stackY } from '$lib';
    
    const { riaa} = getContext('data');
</script>
  
<Plot grid title="Stack transform">
    <Area fill="group" {...stackY({ 
        data: riaa, 
        x: 'year', 
        y: 'revenue', 
        z: 'format'
    })} />
</Plot>
```
