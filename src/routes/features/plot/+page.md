---
title: Plot
---

The <b>Plot</b> component is the base for each $lib. It takes care of creating the shared scales.



```svelte live
<script>
    import { Plot, Line, Frame } from '$lib';
    import { getContext } from 'svelte';

    const { aapl } = getContext('data');
</script>

<Plot grid frame testid="first">
    <Frame />
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

<Plot inset={10}>
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
    title="Apple stocks"
    subtitle="Daily stocks"
    caption="Source: Lorem Ipsum"
    testid="with-title"
>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot title="Apple stocks" subtitle="Daily stocks" caption="Source: Lorem Ipsum">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

## Custom markup

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
        <h2>
            Headline below plot with
            <a href="#/" on:click={() => alert('works')}>custom link</a>
        </h2>
    {/snippet}
    <Line data={aapl} x="Date" y="Close" />
</Plot>

<style>
    h2 a {
        color: magenta;
        text-decoration: underline;
    }
</style>
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


## Reactive scales test

```svelte live
<script lang="ts">
  import { getContext } from 'svelte';
  import { Plot, Dot,  RuleY } from '$lib';

  const { penguins } = getContext('data');
  let filter = $state(true);

  const justGentoo = penguins.filter(d => d.species === 'Gentoo');
  const others = penguins.filter(d => d.species !== 'Gentoo');
</script>

<label><input type="checkbox" bind:checked={filter} /> show all</label>

<Plot grid>
    {#if !filter}
    <Dot data={others} 
      fill="gray"
      x="culmen_length_mm" 
      y="culmen_depth_mm" 
    />
    {/if}
    <Dot data={justGentoo} 
      fill="red"
      x="culmen_length_mm" 
      y="culmen_depth_mm"
    />
</Plot>

```