---
title: Frame mark
---

<script lang="ts">
    import FramePlot1 from './FramePlot1.svelte';
    import FramePlot2 from './FramePlot2.svelte';
    import FramePlot3 from './FramePlot3.svelte';
</script>

The <b>frame</b> mark can be used to add a rectangle outside your plot boundaries. The
easiest way to add a frame is to set the <b>frame</b> option of the Plot element

```svelte live
<script>
    import { Plot, Line } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

If you need more customization options, you can add the frame manually by explicitely adding the <b
        >Frame</b
    > mark to your plot:

```svelte live
<script>
    import { Plot, Frame, Line } from '$lib';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="frame-demo" inset={20}>
    <Frame fill="yellow" fillOpacity="0.2" stroke="magenta" strokeWidth="2" strokeDasharray="4,4" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot grid inset={20}>
    <Frame fill="yellow" fillOpacity="0.2" stroke="magenta" strokeWidth="2" strokeDasharray="4,4" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

You can even create ggplot style charts:

<FramePlot3 />

```svelte
<Plot inset={10}>
    <Frame fill="#eaeaea" />
    <GridX stroke="#fff" />
    <GridY stroke="#fff" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```
