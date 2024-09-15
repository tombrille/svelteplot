---
title: Minimal
---

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);

    let maxRad = $state(10);
</script>

max radius: <input
    type="range"
    bind:value={maxRad}
    min={0}
    max={20} /><br />

<Plot grid r={{ range: [0, maxRad] }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        r={(d) =>
            Math.pow(
                d.culmen_length_mm * d.culmen_depth_mm,
                4
            )}
        fill="sex" />
</Plot>
```

Linear:

```svelte --live
<script lang="ts">
    import Plot from '$lib/core/Plot.svelte';
    import Dot from '$lib/marks/Dot.svelte';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);

    function linearScaleX({ domain, plotWidth }) {
        const fn = (v) => (v - domain[0]) / (domain[1] - domain[0]) * plotWidth;
        fn.range = () => [0, plotWidth];
        return fn;
    } 
    function linearScaleY({ domain, plotHeight }) {
        const fn = (v) => (v - domain[0]) / (domain[1] - domain[0]) * plotHeight;
        fn.range = () => [0, plotHeight];
        return fn;
    } 

</script>

<Plot x={{ scale: linearScaleX  }}
    y={{ scale: linearScaleY }}>
    <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" />
</Plot>
```
