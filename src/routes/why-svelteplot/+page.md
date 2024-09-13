---
title: Why SveltePlot?
description: SveltePlot is heavily inspired by Observable Plot, so much so that you may ask, why do it even exists
---

SveltePlot is heavily inspired by [Observable Plot](https://observablehq.com/plot/). But while it draws on the same concepts and follows a close-to-identical API, SveltePlot is also very different in many regards.

```svelte live
<script>
    import { Plot, Line, AxisY } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);

    import { Slider } from '$lib/ui';

    let truncate = $state(aapl.length);
    let data = $derived(aapl.slice(0, truncate));
</script>

<Slider label="truncate" bind:value={truncate} min={50} max={aapl.length} />
<Plot inset={10} grid>
    <Line marker={truncate < 100} {data} x="Date" y="Close" curve="monotone-x" />
</Plot>
```

## Reactive plotting

Observable Plot follows a fire-and-forget logic: You pass your config options to `Plot.plot()` and it returns a basically static SVG element with the chart (see the official [documentation](https://observablehq.com/plot/features/interactions#custom-reactivity)).

In contrast, in **SveltePlot** the plot and mark components are _reactive components_, so the _data_ and _channel_ definitions are just the properties you pass into. Whenever you change a channel assignment or the data array, the plot will update itself, re-using the existing DOM.

Take the following example, where you can filter the data using the [filter](/transforms/filter/) transform, which is bound to a range input. When the plot updates itself, only the dot marks get updated:

```svelte live
<script>
    import { Plot, Dot } from '$lib';
    import { page } from '$app/stores';
    let { cars } = $derived($page.data.data);
    let min = $state(0);
    let noAxisX = $state(false);
    let noAxisTitle = $state(false);
</script>

<label>min economy (mpg): <input type="range" max={50} bind:value={min} /> ({min})</label>

<Plot grid testid="cars" color={{ type: 'linear' }}>
    <Dot
        data={cars}
        filter={(d) => d['economy (mpg)'] > min}
        y="weight (lb)"
        x="power (hp)"
        r={4}
        stroke="economy (mpg)"
    />
</Plot>
```

```svelte
<Plot grid color={{ type: 'linear' }}>
    <Dot
        data={cars}
        filter={(d) => d['economy (mpg)'] > min}
        y="weight (lb)"
        x="power (hp)"
        r={4}
        stroke="economy (mpg)"
    />
</Plot>
```

Here's an example where we're binding a live-updated dataset to a line mark. Note how the `<path>` elements rendering the line and area get re-used, and ticks and grid lines get moved around instead of being re-created on every frame:

```svelte live
<script lang="ts">
    import { Plot, LineY, RuleY, AreaY, Dot, Text } from '$lib/index.js';
    import { noise } from '$lib/helpers/noise.js';

    let rand: number[] = $state([]);
    let maxLen = $state(200);

    const S = Math.ceil(Math.random() * 1e7);

    // const rand = range(400).map(i => ({ x: i - 200, y: noise(i/20) * 200 - 100 }))
    let mag = $state(1);

    function addLine() {
        do {
            const prevI = rand.length ? rand.at(-1).x : 200;
            mag = Math.pow(10, Math.floor(Math.log10(prevI) - 2));
            const i = prevI + mag;
            const pt = { x: i, y: (noise(i / 40 / mag) * 100 - 50) * Math.log10(mag * 10) * 5 };
            rand = [...rand.slice(-maxLen), pt];
        } while (rand.length < 150);
        maxLen = noise(S + rand.at(-1).x / 60 / mag) * 80 + 200;
        setTimeout(addLine, 50);
    }

    $effect(async () => {
        if (!rand.length) addLine();
    });
</script>

<Plot
    grid
    marginRight={10}
    marginLeft={35 + Math.log10(mag) * 5}
    inset={10}
    y={{ tickSpacing: 30, nice: true }}
    x={{ tickSpacing: 90, insetRight: 30 }}
    color={{ type: 'categorical' }}
    height={250}
>
    <RuleY data={[0]} />
    {#if rand.length > 1}
        <AreaY data={rand} x="x" y="y" fill="currentColor" opacity={0.1} />
        <LineY data={rand} x="x" y="y" stroke="currentColor" />
        <Dot data={[rand.at(-1)]} x="x" y="y" fill="currentColor" />
        <Text
            data={[rand.at(-1)]}
            x="x"
            y="y"
            fontWeight="bold"
            stroke="var(--svelteplot-bg)"
            strokeWidth={3}
            fill="currentColor"
            textAnchor="start"
            dx={6}
            text={(d) => d.y.toFixed(0)}
        />
    {/if}
</Plot>
```

Also, simply by being a reactive Svelte framework, SveltePlot supports using **tweened transitions** out of the box! In the following plot, we're using the [tweened store](https://svelte.dev/docs/svelte-motion#tweened) from `svelte/motion` to smoothly update the vertical domain whenever the data changes.

```svelte live
<script>
    import { Plot, RuleY, BarY } from '$lib';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { extent } from 'd3-array';
    import { fade } from 'svelte/transition';

    let data = $state([1, 2, 3, 4, 5]);

    const domain = tweened(extent([0, ...data]), {
        duration: 1000,
        easing: cubicOut
    });

    $effect(() => {
        $domain = extent([0, ...data]);
    });
</script>

<button onclick={() => data.push(data.at(-1) + (data.length - 3))}>add number</button>
<button
    onclick={() => {
        data = [1, 2, 3, 4, 5];
    }}>reset</button
>

<Plot
    x={{ axis: false, padding: data.length < 60 ? 0.1 : 0 }}
    color={{ scheme: 'RdBu' }}
    y={{ grid: true, domain: $domain }}
>
    <BarY {data} fill={(d) => d} t={fade} />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let data = $state([1, 2, 3, 4, 5]);

    const domain = tweened(extent([0, ...data]), {
        duration: 1000,
        easing: cubicOut
    });

    $effect(() => {
        // update domain whenever data changes
        $domain = extent([0, ...data]);
    });
</script>

<button onclick={(d) => data.push(Math.random())}>add number</button>

<Plot color={{ scheme: 'RdBu' }} y={{ grid: true, domain: $domain }}>
    <BarY {data} fill={(d) => d} />
    <RuleY data={[0]} />
</Plot>
```

## Responsive plot design

Being a reactive framework, SveltePlot also makes it easier to design responsive plots, or -- in other words -- plots that react to their width. Note that again, changing the width of the plot doesn't lead to a full re-rendering.

In the following example, we're switching from the implicit y axis to a custom AxisY mark when the plot width goes below 600 pixels. The custom AxisY is configured to display the tick labels "inside" the plot.

```svelte live
<script>
    import { Plot, Line, AxisY } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);

    let plotWidth = $state(600);
    let isMobile = $derived(plotWidth < 600);
</script>

{plotWidth}
{isMobile}
<div bind:clientWidth={plotWidth}>
    <Plot
        grid
        x={{
            insetLeft: isMobile ? 25 : 10,
            tickFormat: isMobile ? "'YY" : 'YYYY'
        }}
        height={isMobile ? 300 : 400}
    >
        {#if isMobile}
            <AxisY tickSize={0} tickPadding={0} dy={-5} lineAnchor="bottom" textAnchor="start" />
        {/if}
        <Line data={aapl} x="Date" y="Close" />
    </Plot>
</div>
```

```svelte
<Plot
    grid
    marginRight={isMobile ? 0 : 20}
    marginLeft={isMobile ? 0 : 40}
    x={{
        insetLeft: isMobile ? 25 : 10,
        tickFormat: isMobile ? "'YY" : 'YYYY'
    }}
    height={isMobile ? 300 : 400}
    inset={isMobile ? 5 : 10}
>
    {#if isMobile}
        <!-- custom y axis on mobile -->
        <AxisY tickSize={0} tickPadding={0} dy={-5} lineAnchor="bottom" textAnchor="start" />
    {/if}
    <Line data={aapl} x="Date" y="Close" />
</Plot>
```

## Events!

Another difference to Observable Plot is that you can pass event handlers to the marks to make them part of your interactive app.

```svelte live
<script>
    import { Plot, RuleY, BarY } from '$lib';

    let clicked = $state();
    let hover = $state(null);

    let src = $state([-2, -1, 2, 4, 6, 9, 5]);
    let data = $derived(src.map((y, x) => ({ x, y, hover: hover === x })));
    let title = $derived(clicked ? `You clicked ${JSON.stringify(clicked.y)}` : 'Click the bars');
</script>

<Plot x={{ axis: false }} y={{ grid: true }} color={{ type: 'linear', scheme: 'reds' }} {title}>
    <BarY
        {data}
        x="x"
        y="y"
        fill={(d) => d.x}
        cursor="pointer"
        opacity={{ scale: null, value: (d) => (!clicked || clicked.x === d.x ? 1 : 0.5) }}
        onclick={(evt, d) => (src[d.x] *= 1.1)}
        onmouseenter={(evt, d) => (clicked = d)}
        onmouseleave={(evt, d) => (hover = null)}
    />
    <RuleY data={[0]} />
</Plot>

{hover}
```

```svelte
<Plot x={{ axis: false }} y={{ grid: true }} {title}>
    <BarY
        data={[-2, -1, 2, 4, 6, 9, 5]}
        cursor="pointer"
        opacity={{
            scale: null,
            value: (d) => (!clicked || clicked === d ? 1 : 0.5)
        }}
        onclick={(d) => (clicked = d)}
    />
    <RuleY data={[0]} />
</Plot>
```

## Easy to extend

You can extend SveltePlot by injecting regular Svelte snippets. For instance, the Line mark allows you to provide custom markers by passing a `marker` snippet. So why no use animated line markers, just because we can?

:::warning
this example is currently broken in the static docs builds
:::

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib';
    import { fly, fade } from 'svelte/transition';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);

    let shown = $state(false);

    $effect(() => {
        const t = setInterval(() => {
            shown = !shown;
        }, 1000);
        return () => clearInterval(t);
    });
</script>

<Plot grid height={300}>
    <Line data={aapl.slice(-40)} curve="basis" x="Date" y="Adj Close">
        <!-- {#snippet marker(id, color)}
            <marker
                {id}
                fill="none"
                stroke={color}
                markerWidth="6"
                markerHeight="10"
                viewBox="-4 -10 8 10"
                orient="auto"
            >
                {#if shown}
                    <path
                        in:fly={{ duration: 1000, y: -10 }}
                        out:fade
                        d="M0,-10L0,-2m-3,-3 l3,3l3,-3"
                    />
                {/if}
            </marker>
        {/snippet} -->
    </Line>
</Plot>
```

```svelte
<script>
    // ...
    import { fly, fade } from 'svelte/transition';

    let shown = $state(false);

    $effect(() => {
        const t = setInterval(() => {
            shown = !shown;
        }, 1000);
        return () => clearInterval(t);
    });
</script>

<Plot grid height={300}>
    <Line data={aapl.slice(-40)} x="Date" y="Adj Close" curve="basis">
        {#snippet marker(id, color)}
            <marker
                {id}
                fill="none"
                stroke={color}
                markerWidth="6"
                markerHeight="10"
                viewBox="-4 -10 8 10"
                orient="auto"
            >
                {#if shown}
                    <path
                        in:fly={{ duration: 1000, y: -10 }}
                        out:fade
                        d="M0,-10L0,-2m-3,-3 l3,3l3,-3"
                    />
                {/if}
            </marker>
        {/snippet}
    </Line>
</Plot>
```

## Everything is a channel

In Observable Plot, there's a distinction between _channels_ and _non-channels_. Channels can be defined using keys or functions, while the non-channels can only be assigned constant values. That means, for instance, that for the text mark, you can set the `fontSize` as a function but not the `fontWeight`.

In SveltePlot there's no such distinction and you can define almost all options either as function, as data key, or as a constant value. The only difference is that in some cases, the channels are bound to a _scale_.

Like Observable Plot, SveltePlot tries to automatically detect wether or not to map values to a scale. Consider the following example, where the _fill_ channel is mapped to the `"species"` key, while the _stroke_ channel is mapped to a function returning either `"red"` or `"blue"`. SveltePlot will bind the fill channel to the color scale, but not the stroke channel, since it already maps to valid colors.

```svelte
<Plot>
    <Dot data={penguins} fill="species" stroke={(d) => (d.sex === 'M' ? 'red' : 'blue')} />
</Plot>
```

## Custom SVG

You can nest and combine marks with regular SVG. This may be useful for styling or for implementing custom interactions. Essentially, everything you can do in raw SVG, you can throw into a Plot body:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    {#snippet children({ width, height })}
        <defs>
            <filter id="neon">
                <feFlood flood-color="rgb(255,0,128)" flood-opacity="0.5" in="SourceGraphic" />
                <feComposite operator="in" in2="SourceGraphic" />
                <feGaussianBlur stdDeviation="5" />
                <feComponentTransfer result="glow1">
                    <feFuncA type="linear" slope="4" intercept="0" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode in="glow1" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <circle cx={width * 0.5} cy={height * 0.5} r="130" opacity="0.1" fill="currentColor" />
        <g filter="url(#neon)">
            <Line data={aapl} x="Date" y="Adj Close" />
        </g>
    {/snippet}
</Plot>
```

```svelte
<Plot grid>
    {#snippet children({ width, height })}
        <defs>
            <filter id="neon"><!-- ... --></filter>
        </defs>
        <circle cx={width * 0.5} cy={height * 0.5} r="130" opacity="0.1" fill="currentColor" />
        <g filter="url(#neon)">
            <Line data={aapl} x="Date" y="Adj Close" />
        </g>
    {/snippet}
</Plot>
```

## Custom HTML

SveltePlot also lets you throw in custom HTML markup using the _overlay_ and _underlay_ snippets. The **overlay** snippet is rendered in a DIV element above your plot, so you can use it for HTML tooltips or legends positioned inside a plot. The corresponding **underlay** snippet is put behind the plot, which can be used for things like watermarks and background images.

Since the markup is defined in your code and passed as [snippet](https://svelte-5-preview.vercel.app/docs/snippets), you can also make use of the scoped styles and other Svelte features!

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="overlay">
    {#snippet overlay()}
        <p>
            Occaecat tempor mollit <strong>labore proident</strong> officia eu sit tempor deserunt
            commodo. In <a href="#top">Lorem deserunt</a> sint excepteur ullamco Lorem id do.
        </p>
    {/snippet}
    {#snippet underlay()}
        <div class="bg" />
    {/snippet}
    <Line data={aapl} x="Date" y="Adj Close" strokeWidth={2} />
</Plot>

<style>
    p {
        position: relative;
        top: 1em;
        left: 3em;
        padding: 1ex 1em;
        background: var(--svelteplot-bg);
        border: 1px solid #77777799;
        border-radius: 4px;
        max-width: 40%;
        box-shadow: 2px 2px 6px #00000055;
    }
    p a {
        text-decoration: underline;
        color: #d7195a;
    }
    .bg {
        position: absolute;
        left: 2em;
        right: 2em;
        top: 2em;
        bottom: 2em;
        opacity: 0.3;
        background: transparent url(/logo.png) no-repeat center center;
        background-size: contain;
    }
</style>
```

```svelte
<Plot grid>
    {#snippet overlay()}
        <p>Occaecat tempor mollit <strong>labore proident</strong> off...</p>
    {/snippet}
    {#snippet underlay()}
        <div class="bg" />
    {/snippet}
    <Line data={aapl} x="Date" y="Adj Close" strokeWidth={2} />
</Plot>

<style>
    p {
        /* fire away */
    }
    .bg {
        background: transparent url(/logo.png) no-repeat center center;
        background-size: contain;
        /* ... */
    }
</style>
```
