<script lang="ts">
    import { Figure, Frame, Dot, DotX, DotY, GridX, GridY } from '$lib';
    import RuleX from '$lib/marks/RuleX.svelte';
    import CandlestickExample from './marks/rule/CandlestickExample.svelte';

    let marginLeft = $state(30);
    let marginRight = $state(20);
    let marginTop = $state(5);
    let marginBottom = $state(20);

    const demoData = [
        { x: 0, y: 0, size: 6 },
        { x: 1, y: 1, size: 5 },
        { x: 2, y: 2, size: 3 },
        { x: 4, y: 3, size: 6 },
        { x: 5, y: 1, size: 5 },
        { x: 6, y: 2, size: 3 },
        { x: 8, y: 0.25, size: 6 },
        { x: 9, y: 2, size: 5 },
        { x: 11, y: 1, size: 3 }
    ];

    let cutoff = $state(demoData.length);
    let maxRad = $state(6);
    let hasFrame = $state(true);
    let useData = $derived(demoData.slice(0, cutoff));
</script>

<div class="content">
    <h1>Welcome to SveltePlot</h1>

    <p>
        <b>SveltePlot</b> is an open-source plotting library for Svelte based on
        <a href="https://d3js.org/">D3.js</a>
        and heavily inspired by <a href="https://observablehq.com/plot/">Observable Plot</a>.
    </p>

    <p>
        Like Observable Plot, you can use SveltePlot to construct visualizations by stacking marks
        on top of each other, which are automatically sharing common scales such as x, y, or color.
    </p>

    <h4>Differences to Observable Plot</h4>

    <p>
        Most importantly, <b>SveltePlot</b> is built on top of
        <a href="https://svelte.dev/">Svelte</a>. That means that it doesn't re-render the entire
        plot every time you make changes to the plot configuration, but only updates the parts that
        have changed. That means you can not just stack marks but also group them arbitrarily.
    </p>
</div>
marginLeft:<input type="range" bind:value={marginLeft} min={0} max={100} /><br />
marginRight: <input type="range" bind:value={marginRight} min={0} max={100} /><br />
marginTop: <input type="range" bind:value={marginTop} min={0} max={100} /><br />
marginBottom: <input type="range" bind:value={marginBottom} min={0} max={100} /><br />
cutoff: <input type="range" bind:value={cutoff} min={0} max={demoData.length} /><br />
max radius: <input type="range" bind:value={maxRad} min={0} max={20} /><br />
has frame: <input type="checkbox" bind:checked={hasFrame} /><br />
<hr />

<Figure {marginLeft} {marginRight} {marginBottom} {marginTop} radius={{ range: [1, maxRad] }}>
    {#snippet header()}
        <h2>Figure with header</h2>
        <h3>and a subtitle</h3>
    {/snippet}
    <GridX />
    <GridY />
    {#if hasFrame}
        <Frame />
    {/if}
    <Dot
        data={useData}
        x="x"
        y="y"
        fill={(d) => (d.x < 5 ? 'red' : 'blue')}
        stroke="black"
        r={hasFrame ? 'size' : 'y'}
    />
    <RuleX
        data={[0, 1, -2]}
        stroke="red"
        y1={1.5}
        y2={(v) => Math.abs(v + 1) * 0.5}
        strokeWidth="10"
        opacity="0.2"
    />
    {#snippet footer()}
        <figcaption>and some words below</figcaption>
    {/snippet}
</Figure>

<CandlestickExample />

<p>Being Svelte-native also means you can pass event callback to the marks:</p>

<div style="display:flex;">
    <div style="flex-grow: 1;max-width:50%">
        <Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
            {#snippet header()}<h3 style="text-align:center">DotX</h3>{/snippet}
            <GridX /><GridY />
            <Frame />
            <DotX
                data={[-2, 1, 2, 3, 4, 5, 10]}
                fill="blue"
                strokeWidth="4"
                stroke={() => (Math.random() < 0.5 ? 'pink' : 'green')}
            />
        </Figure>
    </div>
    <div style="flex-grow: 1;max-width:50%">
        <Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
            {#snippet footer()}<h3 style="text-align:center">DotY</h3>{/snippet}
            <GridX tickFormat={(d) => d.toFixed(2)} /><GridY />
            <Frame />
            <DotY data={[-2, 1, 2, 3, 4, 5, 10]} fill="blue" />
        </Figure>
    </div>
</div>

<b>Custom grid ticks</b>

<Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
    <GridX data={[-3, 1, 2, 3, 4, 5, 10]} /><GridY data={[-1, 2, 3, 4, 6]} />
    <DotX data={[-2, 1, 2, 3, 4, 5, 10]} r={3} />
</Figure>

Another one using [[x0,y0], [x1,y1], ...] coordinates:

<Figure height={350} {marginLeft} {marginRight} {marginBottom} {marginTop}>
    <GridX />
    <GridY label="y" />
    <Frame />
    <Dot
        data={[
            [0, 10],
            [3, 11],
            [4, 9],
            [5, 9.6],
            [8, 12]
        ]}
    />
</Figure>

<!-- -->

<style>
    h3 {
        font-weight: 400;
        margin-bottom: 1ex;
    }
    :global(figcaption) {
        color: #999;
    }
</style>
