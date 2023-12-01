<script lang="ts">
    import { Figure, Frame, Line, LineX, LineY, RuleX } from '$lib';

    import type { Datasets } from '$lib/types';
    import { range } from 'd3-array';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');

    let cutoff1 = $state(0);
    let cutoff2 = $state(aapl.length);
</script>

cutoff1: <input type="range" bind:value={cutoff1} min={0} max={cutoff2 - 1} /><br />
cutoff2: <input type="range" bind:value={cutoff2} min={cutoff1} max={aapl.length} /><br />

<h1 class="title">Lines</h1>

<p>Lines are cool</p>

<Figure grid>
    <Line data={aapl.slice(cutoff1, cutoff2)} x="Date" y="Adj Close" />
</Figure>

<pre class="block"><code
        >{`<Figure grid>
    <Line data={aapl} x="Date" y="Adj Close" /> 
</Figure>`}</code
    ></pre>

<p class="block">Use can use the <b>LineY</b> mark to quickly plot an array of numbers as line:</p>

<Figure grid height="200">
    <LineY data={range(100).map((v) => Math.cos(v / 5))} />
</Figure>

<pre class="block"><code
        >{`<Figure grid height="200">
    <LineY data={range(100).map(v => Math.cos(v/5))} />
</Figure>`}</code
    ></pre>

<p class="block">
    Similarily, you can use <b>LineX</b> mark to quickly plot an array of numbers as lines, but the values
    will be used as x values instead:
</p>

<Figure grid height="400" maxWidth="300px">
    <Frame stroke="lightgrey" />
    <RuleX data={[0]} />
    <LineX data={range(Math.PI * 20).map((v) => Math.sin(v / 10))} stroke="teal" strokeWidth="2" />
</Figure>

<pre class="block"><code
        >{`<Figure grid height="400" maxWidth="300px">
    <RuleX data={[0]} />
    <LineX 
        data={range(Math.PI*20).map(v => Math.sin(v/10))}
        stroke="teal"
        strokeWidth="2" />
</Figure>`}</code
    ></pre>
