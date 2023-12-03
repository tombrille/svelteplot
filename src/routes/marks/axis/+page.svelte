<script lang="ts">
    import { Figure, GridX, GridY, Line } from '$lib';
    import { getContext } from 'svelte';
    import SineRules from '../rule/SineRules.svelte';
    import type { Datasets } from '$lib/types';

    const { aapl } = getContext<Datasets>('data');
</script>

<h1 class="title">Axes</h1>

<p>
    By default SveltePlot will create axis marks automatically:
</p>

<Figure>
    <Line data={aapl} x="Date" y="Close" />
</Figure>

<pre class="block"><code
        >{`<Figure>
    <Line data={aapl} x="Date" y="Close" />
</Figure>`}</code
    ></pre>

<p class="block">
    You can turn the grids on individually using by adding <code>grid: true</code> to the x and y scale
    options:
</p>

<div class="columns">
    <div class="column is-half">
        <Figure frame height={300} x={{ grid: true }} />
    </div>
    <div class="column is-half">
        <Figure frame height={300} y={{ grid: true }} />
    </div>
</div>

<pre class="block"><code
        >{`<Figure height={300} x={{ grid: true }} />
<Figure height={300} y={{ grid: true }} />`}</code
    ></pre>

<p class="block">
    Or you can add the <b>GridX</b> and <b>GridY</b> marks explicitely for more options, such as layering
    grids on top of other marks. Note that in this case, custom grid ticks are not synchronized with the axes marks.  
</p>

<Figure x={{ domain: [0, 5] }} y={{ domain: [0, 5] }}>
    <GridX stroke="lime" />
    <GridY stroke="magenta" ticks={[0, 1.5, 2, 2.5, 4, 5]} />
</Figure>

<pre class="block"><code
        >{`<Figure x={{domain:[0,5]}} y={{domain:[0,5]}}>
    <GridX stroke="lime" />
    <GridY stroke="magenta" ticks={[0,1.5,2,2.5,4,5]} />
</Figure>`}</code
    ></pre>

<p class="block">Use can provide custom ticks to grids using the <b>ticks</b> option:</p>

<SineRules />

<p>The automatic ticks can be customized using the <b>tickSpacing</b> option:</p>

<Figure grid x={{ tickSpacing: 40 }} y={{ tickSpacing: 10 }}>
    <Line data={aapl} x="Date" y="Close" />
</Figure>

<pre class="block"><code
        >{`<Figure grid x={{ tickSpacing: 40 }} y={{ tickSpacing: 10 }}>
    <Line data={aapl} x="Date" y="Close" />
</Figure>`}</code
    ></pre>
