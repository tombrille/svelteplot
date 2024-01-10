---
title: Bar mark
---

<script>
    import BarPlot from './BarPlot.svelte';
</script>

Bars are cool

<BarPlot />

```svelte
<Plot grid y={{ percent: true, label: 'Frequency (%)' }}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y1={0} y2="frequency" />
</Plot>
```

## BarY

- `x`
- `y1`
- `y2`

## BarX

- `y`
- `x1`
- `x2`