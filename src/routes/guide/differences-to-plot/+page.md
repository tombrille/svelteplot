---
title: Differences to Observable Plot
---

SveltePlot is heavily inspired by Observable Plot, but in some regards it is different.


## Reactive plotting

As the name suggests, SveltePlot is written in Svelte, so all the marks are reactive components, and the _data_ and _channel_ definitions are just their props. Whenever you change mark options, like a channel or the data, the plot will update, re-using the existing DOM.

Take the following example, where you can filter the data using the [filter](/transforms/filter/) transform, which is bound to a range input. When the plot updates itself, only the dot marks get updated:

```svelte live
<script>
    import { Plot, Dot } from '$lib/fresh';
    import { getContext } from 'svelte';
    const { cars } = getContext('data');
    let min = $state(0);
     const manufactor = (d) => d.name.split(' ')[0];
</script>

<label>min economy (mpg): <input type="range" max={50} bind:value={min} /> ({min})</label>

<Plot grid testid="cars" color={{ type: 'linear', scheme: 'turbo' }} marginLeft={50}>
    <Dot data={cars} 
        filter={d => d['economy (mpg)'] > min} 
        y="weight (lb)" 
        x="power (hp)"
        r={4}
        symbol={manufactor}
        stroke='economy (mpg)' />
</Plot>
```


## Everything is a channel

In Observable Plot, there's a distinction between _channels_ and _non-channels_. Channels can be defined using keys or function, while the non-channels can only be assigned constant values. That means, for instance, that for the text mark, you can set the `fontSize` as a function but not the `fontWeight`.

In SveltePlot there's no such distinction and you can define almost all options either as function, as data key, or as a constant valye. The only difference is that in some cases, the channels are bound to a _scale_. 

Like Observable Plot, SveltePlot tries to automatically detect wether or not to map values to a scale. Consider the following example, where the *fill* channel is mapped to the `"species"` key, while the *stroke* channel is mapped to a function returning either `"red"` or `"blue"`. SveltePlot will bind the fill channel to the color scale, but not the stroke channel, since it already maps to valid colors.

```svelte
<Plot>
    <Dot 
        data={penguins} 
        fill="species"
        stroke={d => d.sex === 'M' ? 'red' : 'blue'} />
</Plot>
```

## Custom SVG

You can nest and combine marks with regular SVG. This may be useful for styling or for implementing custom interactions. Essentially, everything you can do in raw SVG, you can throw into a Plot body:

```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib/fresh';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    const { aapl } = getContext<Datasets>('data');
</script>

<Plot grid let:width let:height>
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
</Plot>
```

```svelte
<Plot grid let:width let:height>
    <defs>
        <filter id="neon"><!-- ... --></filter>
    </defs>
    <circle 
        cx={width * 0.5} cy={height * 0.5} r="130" 
        opacity="0.1" fill="currentColor" />
    <g filter="url(#neon)">
        <Line data={aapl} x="Date" y="Adj Close" />
    </g>
</Plot>
```

## Custom HTML

SveltePlot also lets you throw in custom HTML markup using the _overlay_ and _underlay_ snippets. The **overlay** snippet is rendered in a DIV element above your plot, so you can use it for HTML tooltips or legends positioned inside a plot. The corresponding **underlay** snippet is put behind the plot, which can be used for things like watermarks and background images.

Since the markup is defined in your code and passed as [snippet](https://svelte-5-preview.vercel.app/docs/snippets), you can also make use of the scoped styles and other Svelte features!


```svelte live
<script lang="ts">
    import { Plot, Line } from '$lib/fresh';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    const { aapl } = getContext<Datasets>('data');
</script>

<Plot grid testid="overlay">
    {#snippet overlay()}
        <p>Occaecat tempor mollit <strong>labore proident</strong> officia eu sit tempor deserunt commodo.
In <a href="#top">Lorem deserunt</a> sint excepteur ullamco Lorem id do.</p>
    {/snippet}
    {#snippet underlay()}
        <div class="bg" />
    {/snippet}
    <Line data={aapl} x="Date" y="Adj Close" strokeWidth={2} />
</Plot>


<style>
    p {
        position:relative;
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
    p { /* fire away */ }
    .bg {  
        background: transparent url(/logo.png) no-repeat center center;
        background-size: contain;
        /* ... */
    }
</style>
```