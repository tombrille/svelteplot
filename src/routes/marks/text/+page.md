---
title: Text mark
---

Useful for showing SVG labels!

```svelte live
<script>
    import { Plot, Dot, Text } from '$lib';

    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot
    grid
    height={500}
    color={{ legend: true }}
    testid="penguins">
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="currentColor"
        r={3} />
    <Text
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        stroke="var(--svelteplot-bg)"
        strokeWidth={5}
        strokeOpacity={0.7}
        dx={-3}
        dy={-5}
        textAnchor="start"
        lineAnchor="bottom" 
        fontWeight={(d) =>
            d.species === 'Gentoo' ? 'bold' : 'normal'}
        text={(d) => d.island} />
</Plot>
```

```svelte
<Plot grid height={500} color={{ legend: true }}>
    <Text
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        text={(d) => d.island.charAt(0)} />
</Plot>
```

## Text options

The following channels are required:

-   **text** - the text contents (a string, possibly with multiple lines)
-   **x** - the horizontal position; bound to the _x_ scale
-   **y** - the vertical position; bound to the _y_ scale

## Text options

-   **fontSize** - the font size in pixels

TODO: add example for multiline text