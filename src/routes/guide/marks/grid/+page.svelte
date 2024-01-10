<script lang="ts">
    import { Plot, GridX, GridY, Line } from '$lib/index.js';
    import { getContext } from 'svelte';
    import SineRules from '../rule/SineRules.svelte';
    import type { Datasets } from '$lib/types.js';
    import Code from '../../Code.svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<div class="content">
    <h1>Grids</h1>

    <p>
        You can let SveltePlot create grids automatically for you by setting the <code>grid</code>
        flag on the <b>Plot</b>:
    </p>

    <Plot grid testid="grid">
        <Line data={aapl} x="Date" y="Close" />
    </Plot>

    <Code
        code={`<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
    />

    <p class="block">
        You can turn the grids on individually using by adding <code>grid: true</code> to the x and y
        scale options:
    </p>

    <div class="columns">
        <div class="column is-half">
            <Plot frame height={300} x={{ grid: true }} testid="grid-x" />
        </div>
        <div class="column is-half">
            <Plot frame height={300} y={{ grid: true }} testid="grid-y" />
        </div>
    </div>

    <Code
        code={`<Plot height={300} x={{ grid: true }} />
<Plot height={300} y={{ grid: true }} />`}
    />

    <p class="block">
        Or you can add the <b>GridX</b> and <b>GridY</b> marks explicitely for more options, such as
        layering grids on top of other marks. Note that in this case, custom grid ticks are not synchronized
        with the axes marks.
    </p>

    <Plot x={{ domain: [0, 5] }} testid="custom">
        <GridX stroke="lime" />
        <GridY stroke="magenta" ticks={[0, 1.5, 2, 2.5, 4, 5]} />
    </Plot>

    <Code
        code={`<Plot x={{domain:[0,5]}} y={{domain:[0,5]}}>
    <GridX stroke="lime" />
    <GridY stroke="magenta" ticks={[0,1.5,2,2.5,4,5]} />
</Plot>`}
    />

    <p>The automatic ticks can be customized using the <b>tickSpacing</b> option:</p>

    <Plot grid x={{ tickSpacing: 150 }} y={{ tickSpacing: 10 }} testid="tickspacing">
        <Line data={aapl} x="Date" y="Close" />
    </Plot>

    <Code
        code={`<Plot grid x={{ tickSpacing: 150 }} y={{ tickSpacing: 10 }}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
    />
</div>
