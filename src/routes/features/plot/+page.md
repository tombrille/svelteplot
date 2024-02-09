---
title: Plot
---

The <b>Plot</b> component is the base for each plot. It takes care of creating the shared scales.

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { getContext } from 'svelte';

    const { aapl } = getContext('data');
</script>

<Plot grid frame testid="aapl-line-frame">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

You can style plots to look like ggplot:

```svelte live
<script>
    import { Plot, Line, GridX, GridY, Frame } from '$lib';
    import { getContext } from 'svelte';
    const { aapl } = getContext('data');
</script>

<Plot inset={10} testid="ggplot">
    <Frame fill="#eaeaea" />
    <GridX stroke="#fff" strokeOpacity="1" />
    <GridY stroke="#fff" strokeOpacity="1" />
    <Line data={aapl} x="Date" y="Close" stroke="#222" />
</Plot>
```

You can pass **title**, **subtitle**, and **caption** directly as Plot properties:

```svelte live
<script>
    import { Plot, Line, Frame } from '$lib';
    import { getContext } from 'svelte';
    const { aapl } = getContext('data');
</script>

<Plot
    frame
    title="This is a plot title"
    subtitle="This is a subtitle"
    caption="This is the caption"
    testid="with-title"
>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot frame 
    title="This is a plot title"
    subtitle="This is a subtitle"
    caption="This is the caption"">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

## Plot options

List of all plot options you can pass via props on the `<Plot />` component:

-   `title` - you can set the max-width of the plot element
-   `subtitle` - you can set the max-width of the plot element
-   `caption` - a caption to be displayed below the plot
-   `maxWidth` - you can set the max-width of the plot element to prevent the plot from scaling to the container div width
-   `marginTop` - plot margins
-   `marginBottom` -
-   `marginLeft` -
-   `marginRight` -
-   `inset` -
-   `grid` - set this flag to activate automatic grids
-   `x` - options for the x scale
-   `y` - options for the y scale

TODO: List all the options

## Snippets

The Plot component provides 4 entry points for snippets for adding custom markup to the plot.

-   **children** - any component used as child of the Plot component will be inserted into the `svg` element inside the plot body.
-   **header** - HTML div container rendered before the plot body, useful for adding a custom headline or HTML legend marks
-   **footer** - HTML div container rendered after the plot body, useful for customizing the footer or showing a legend below the plot
-   **overlay** - HTML div container floating in front of the plot body, useful for HTML tooltips or for positioning a legend inside the plot area
-   **underlay** - similar to the overlay container, but rendered behind the plot body. Useful for background images or things like watermarks (like in [this example](/guide/differences-to-plot#Custom-HTML))

For more flexibility, you can also use the <code>header</code> and <code>footer</code> snippet/slots
to render custom elements inside the figure element above and below the plot. This also allows you
to add events and scoped styles.

```svelte live
<script>
    import { Plot, Line, Frame } from '$lib';
    import { getContext } from 'svelte';
    const { aapl } = getContext('data');
</script>

<Plot grid>
    {#snippet header()}
        <figcaption>Custom caption above the plot</figcaption>
    {/snippet}
    {#snippet footer()}
        <h4>
            Centered headline below plot with
            <a href="#/" on:click={() => alert('works')}>custom link</a>
        </h4>
    {/snippet}
    <Line data={aapl} x="Date" y="Close" />
</Plot>

<style>
    h4 {
        margin-top: 0;
        text-align: center;
        font-size: 1.15rem;
    }
    h4 a {
        color: magenta;
        text-decoration: underline;
    }
</style>
```

## Reactive scales test

```svelte live
<script lang="ts">
    import { getContext } from 'svelte';
    import { Plot, Dot, RuleY } from '$lib';

    const { penguins } = getContext('data');
    let filter = $state(false);
    let minWeight = $state(8000);

    const justGentoo = penguins.filter((d) => d.species === 'Gentoo');
    const others = penguins.filter((d) => d.species !== 'Gentoo');
</script>

<label><input type="checkbox" bind:checked={filter} /> just Gentoo</label><br />
<label
    >min weight: <input type="range" min={3000} max={8000} bind:value={minWeight} />
    ({minWeight})</label
>

<Plot grid>
    {#if !filter}
        <Dot
            data={others}
            fill="gray"
            x="culmen_length_mm"
            y="culmen_depth_mm"
            filter={(d) => d.body_mass_g < minWeight}
        />
    {/if}
    <Dot
        data={justGentoo}
        fill="red"
        x="culmen_length_mm"
        y="culmen_depth_mm"
        filter={(d) => d.body_mass_g < minWeight}
    /> />
</Plot>
```
