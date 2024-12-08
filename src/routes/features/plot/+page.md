---
title: Plot
---

The <b>Plot</b> component is the base for each plot. It takes care of managing the shared [scales](/features/scales), computes smart default options and implicitly creates axis, grid, frame, and legend marks.

In the following example, you can see that the `<Plot>` component has added axes, grids, and a frame for us, so we don't have to add them to our plots every time we need them.

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid frame testid="aapl-line-frame">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<script>
    import { Plot, Line } from '@gka/svelteplot';
    import aapl from './aapl.csv';
</script>

<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

:::info
The implicit axes are added by default.
:::

But if we wanted to, we can add these marks individually, and it would look just the same. Using the explicit marks gives us more control over styling and the rendering order.

```svelte live
<script>
    import {
        Plot,
        Frame,
        GridX,
        GridY,
        AxisX,
        AxisY,
        Line
    } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot testid="aapl-line-frame">
    <Frame />
    <GridX />
    <GridY />
    <AxisX />
    <AxisY />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<script>
    import {
        Plot,
        Frame,
        GridX,
        GridY,
        AxisX,
        AxisY,
        Line
    } from '@gka/svelteplot';
    import aapl from './aapl.csv';
</script>

<Plot>
    <Frame />
    <GridX />
    <GridY />
    <AxisX />
    <AxisY />
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

This can be useful if you want to customize the styling of the frame or grids, for instance. So you can style plots to look like [ggplot2](https://ggplot2.tidyverse.org/)'s default theme:

```svelte live
<script>
    import { Plot, Line, GridX, GridY, Frame } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot inset={10} testid="ggplot">
    <Frame fill="#eaeaea" />
    <GridX stroke="#fff" strokeOpacity="1" />
    <GridY stroke="#fff" strokeOpacity="1" />
    <Line data={aapl} x="Date" y="Close" stroke="#222" />
</Plot>
```

For convenience, you can pass **title**, **subtitle**, and **caption** to the Plot component and it will create headings and a figure caption for you:

```svelte live
<script>
    import { Plot, Line, Frame } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot
    grid
    title="This is a plot title"
    subtitle="This is a subtitle"
    caption="This is the caption"
    testid="with-title">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot grid
    title="This is a plot title"
    subtitle="This is a subtitle"
    caption="This is the caption"">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

By default, the Plot element will fill 100% of it's parent container width, but you can set a custom **maxWidth**, too:

```svelte live
<script>
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid maxWidth="300px">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

```svelte
<Plot grid maxWidth="300px">
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

## Plot options

List of all plot options you can pass via props on the `<Plot />` component:

- `class` - set a HTML class to be added to the `<figure>` element. Useful for applying additional CSS styling.
- `title` - a title to be displayed as `<h2>` element above the plot
- `subtitle` - a subtitle to be displayed as `<h3>` element above the plot
- `caption` - a caption to be displayed as `<figcaption>` below the plot
- `locale` - locale to be used for number and date formatting, e.g. in axis ticks

**Size and margins**
- `maxWidth` - you can set the max-width of the plot element to prevent the plot from scaling to the container div width
- `height` 
- `marginTop` - plot margins
- `marginBottom` -  margins
- `marginLeft` - margins
- `marginRight` - margins
- `margin` - shortcut to set all 4 margins to the same value
- `inset` - shortcut for setting all insets. To set individual insets, see `x` and `y` scale options.

**Implicit marks**
- `grid` - set this flag to activate implicit grids
- `axes` - set this flag to activate implicit axes
- `frame` - set this flag to activate implicit frame

**Scale options**
- `x` - options for the x scale:
  - `axis`
  - `insetLeft`
  - `insetRight`
  - `ticks`
  - `tickFormat`
- `y` - options for the y scale
- `r` - options for the radius scale
- `color` - options for the color scale
- `opacity` - options for the opacity scale
- `symbol` - options for the symbol scale
- `length` - options for the length scale

- You can set the following shared scale options for all the scales listed above.
  - `domain`
  - `range`
  - `range`

- `locale` - locale used for automatic number and date formatting in axis ticks

TODO: List all the options

## Snippets

The Plot component provides 4 entry points for snippets for adding custom markup to the plot.

- **children** - any component used as child of the Plot component will be inserted into the `svg` element inside the plot body.
- **header** - HTML div container rendered before the plot body, useful for adding a custom headline or HTML legend marks
- **footer** - HTML div container rendered after the plot body, useful for customizing the footer or showing a legend below the plot
- **overlay** - HTML div container floating in front of the plot body, useful for HTML tooltips or for positioning a legend inside the plot area
- **underlay** - similar to the overlay container, but rendered behind the plot body. Useful for background images or things like watermarks (like in [this example](/guide/differences-to-plot#Custom-HTML))

For more flexibility, you can also use the <code>header</code> and <code>footer</code> snippet/slots
to render custom elements inside the figure element above and below the plot. This also allows you
to add events and scoped styles.

```svelte live
<script>
    import { Plot, Line, Frame } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    {#snippet header()}
        <figcaption>
            Custom caption above the plot
        </figcaption>
    {/snippet}
    {#snippet footer()}
        <h4>
            Centered headline below plot with
            <a href="#/" on:click={() => alert('works')}
                >custom link</a>
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

## Core plot

SveltePlot provides a lot of convenience features with the unfortunate side-effect of blowing up the bundle size a bit. In situations where this is a concern, you may use a more light-weight version of the Plot component. Note that you need to explicitely include all marks that you want, such as grids or axis marks.

```svelte live
<script>
    import Plot from '$lib/core/Plot.svelte';
    import { Line } from '$lib';
    import { page } from '$app/stores';
    const { aapl } = $derived($page.data.data);

    // custom x and y scale
    function scaleX({ domain, plotWidth, plotOptions }) {
        const { marginLeft, marginRight } = plotOptions;
        const range = [
            marginLeft,
            plotWidth - marginLeft - marginRight
        ];
        const fn = (v) =>
            ((v - domain[0]) / (domain[1] - domain[0])) *
                (range[1] - range[0]) +
            range[0];
        fn.range = () => range;
        return fn;
    }
    function scaleY({ domain, plotHeight, plotOptions }) {
        const { marginTop, marginBottom } = plotOptions;
        const range = [
            plotHeight - marginTop - marginBottom,
            marginBottom
        ];
        const fn = (v) =>
            ((v - domain[0]) / (domain[1] - domain[0])) *
                (range[1] - range[0]) +
            range[0];
        fn.range = () => range;
        return fn;
    }
</script>

<Plot x={{ scale: scaleX }} y={{ scale: scaleY }}>
    <Line
        data={aapl}
        x={(d) => new Date(d.Date)}
        y="Adj Close" />
</Plot>
```

```svelte
<script>
    import Plot from '@gka/svelteplot/core/Plot.svelte';
    import { Line } from '@gka/svelteplot';

    function scaleX({ domain, plotWidth, plotOptions }) {
        const { marginLeft, marginRight } = plotOptions;
        const range = [
            marginLeft,
            plotWidth - marginLeft - marginRight
        ];
        const fn = (v) =>
            ((v - domain[0]) / (domain[1] - domain[0])) *
                (range[1] - range[0]) +
            range[0];
        fn.range = () => range;
        return fn;
    }
    function scaleY({ domain, plotHeight, plotOptions }) {
        const { marginTop, marginBottom } = plotOptions;
        const range = [
            plotHeight - marginTop - marginBottom,
            marginBottom
        ];
        const fn = (v) =>
            ((v - domain[0]) / (domain[1] - domain[0])) *
                (range[1] - range[0]) +
            range[0];
        fn.range = () => range;
        return fn;
    }
</script>

<Plot x={{ scale: scaleX }} y={{ scale: scaleY }}>
    <Line
        data={aapl}
        x={(d) => new Date(d.Date)}
        y="Adj Close" />
</Plot>
```
