<script lang="ts">
    import { Plot, Frame, Line, LineX, LineY, RuleX } from '$lib/index.js';

    import type { Datasets } from '$lib/types.js';
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

<Plot>
    <Line
        data={aapl.slice(cutoff1, cutoff2)}
        z={(d) => d.Date.getFullYear()}
        stroke={(d) => d.Date.getFullYear()}
        x="Date"
        y="Adj Close"
    />
</Plot>

<pre class="block"><code
        >{`<Plot>
    <Line data={aapl} x="Date" y="Adj Close" /> 
</Plot>`}</code
    ></pre>

<p class="block">Use can use the <b>LineY</b> mark to quickly plot an array of numbers as line:</p>

<Plot grid height="200">
    <LineY data={range(100).map((v) => Math.cos(v / 5))} />
</Plot>

<pre class="block"><code
        >{`<Plot grid height="200">
    <LineY data={range(100).map(v => Math.cos(v/5))} />
</Plot>`}</code
    ></pre>

<p class="block">
    Similarily, you can use <b>LineX</b> mark to quickly plot an array of numbers as lines, but the values
    will be used as x values instead:
</p>

<Plot grid height="400" maxWidth="300px">
    <Frame stroke="lightgrey" />
    <RuleX data={[0]} />
    <LineX data={range(Math.PI * 20).map((v) => Math.sin(v / 10))} stroke="teal" strokeWidth="2" />
</Plot>

<pre class="block"><code
        >{`<Plot grid height="400" maxWidth="300px">
    <RuleX data={[0]} />
    <LineX 
        data={range(Math.PI*20).map(v => Math.sin(v/10))}
        stroke="teal"
        strokeWidth="2" />
</Plot>`}</code
    ></pre>
