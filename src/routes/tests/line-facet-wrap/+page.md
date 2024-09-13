---
title: Line Facet Wrapping
---

```svelte live
<script>
    import {
        Plot,
        RuleY,
        Dot,
        Line,
        windowY,
        Pointer,
        Text
    } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/stores';

    let { rightwing } = $derived($page.data.data);
</script>

<Plot grid height={1000} fz={{ columns: 5 }}>
    <RuleY data={[0]} />
    <Line
        data={rightwing}
        x="year"
        curve="step-before"
        y={(d) => d.right_votes + d.right_populist_votes}
        stroke="country"
        fz="country" />
    <!-- 
  <Line {...smoothed} z="Partei" stroke="var(--svelteplot-bg)" strokeWidth="4" />
  <Line {...smoothed} strokeWidth="2" /> -->
</Plot>
```
