<script lang="ts">
    import { Plot, GridX, GridY, Line, Frame } from '$lib/index.js';
    import { getContext } from 'svelte';
    import SineRules from '../rule/SineRules.svelte';
    import type { Datasets } from '$lib/types.js';
    import Code from '../../Code.svelte';
    import AxisX from '$lib/marks/AxisX.svelte';
    import AxisY from '$lib/marks/AxisY.svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<div class="content">
    <h1>Axis mark</h1>

    <p>By default SveltePlot will create axis marks automatically:</p>

    <Plot>
        <Line data={aapl} x="Date" y="Close" />
    </Plot>

    <Code
        code={`<Plot>
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
    />

    <p>
        You can turn the grids on individually using by adding <code>grid: true</code> to the x and y
        scale options:
    </p>

    <div class="columns">
        <div class="column is-half">
            <Plot frame height={300} x={{ grid: true }} />
        </div>
        <div class="column is-half">
            <Plot frame height={300} y={{ grid: true }} />
        </div>
    </div>

    <Code
        code={`<Plot height={300} x={{ grid: true }} />
<Plot height={300} y={{ grid: true }} />`}
    />

    <p>
        Or you can add the <b>AxisX</b> and <b>AxisY</b> marks explicitely for more options, such as
        layering grids on top of other marks. Note that in this case, custom grid ticks are not synchronized
        with the axes marks.
    </p>

    <Plot frame x={{ domain: [0, 10] }} y={{ domain: [0, 5] }} marginBottom={40} marginRight={30}>
        <AxisX anchor="top" tickSize={10} tickFontSize="14px" />
        <AxisX stroke="cornflowerblue" fill="cornflowerblue" />
        <AxisY fill="green" anchor="right" tickSize={-5} tickPadding={10} />
        <AxisY stroke="magenta" fill="#dd0000" ticks={[0, 1.5, 2, 2.5, 4, 5]} />
    </Plot>

    <Code
        code={`<Plot frame x={{ domain: [0, 10] }} y={{ domain: [0, 5] }} marginBottom={40} marginRight={30}>
    <AxisX anchor="top" tickSize={10} tickFontSize="14px" />
    <AxisX stroke="cornflowerblue" fill="cornflowerblue" />
    <AxisY fill="green" anchor="right" tickSize={-5} tickPadding={10} />
    <AxisY stroke="magenta"fill="#dd0000" ticks={[0, 1.5, 2, 2.5, 4, 5]} />
</Plot>`}
    />

    <p class="block">Use can provide custom ticks to grids using the <b>ticks</b> option:</p>

    <SineRules />

    <p>The automatic ticks can be customized using the <b>tickSpacing</b> option:</p>

    <Plot grid x={{ tickSpacing: 40 }} y={{ tickSpacing: 10 }}>
        <Line data={aapl} x="Date" y="Close" />
    </Plot>

    <Code
        code={`<Plot grid x={{ tickSpacing: 40 }} y={{ tickSpacing: 10 }}>
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
    />

    <p>Custom axis labels</p>

    <Plot grid x={{ label: 'Foo' }} y={{ label: 'Bar' }}>
        <Line data={aapl} x="Date" y="Close" />
    </Plot>
</div>
