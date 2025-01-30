---
title: Test
---

Link to [empty page](empty).

```svelte live
<script lang="ts">
    import { css } from '@emotion/css';
    import { Plot, Line, Dot, AreaY } from '$lib';
    import { Slider } from '$lib/ui';

    import { page } from '$app/stores';
    let { aapl, penguins } = $derived($page.data.data);
    let inset = $state(10);
</script>

<Slider bind:value={inset} min={-20} max={30} />

<Plot grid frame marginTop={35} {css} {inset}>
    <Dot
        data={penguins}
        fx="species"
        fy="sex"
        fill
        onmouseenter={(d, e) => console.log(e)}
        x="culmen_length_mm"
        y="culmen_depth_mm" />
</Plot>
```
