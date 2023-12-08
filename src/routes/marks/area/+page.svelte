<script lang="ts">
    import { Plot, Frame, Area, AreaX, AreaY, Line, RuleY } from '$lib/index.js';

    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import Code from '../../Code.svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<div class="content">
    <h1>Area mark</h1>

    <p>The <b>Area</b> mark is useful for area charts. It pairs nicely with a <b>Line</b> mark for the topline and a <b>RuleY</b> for the baseline:</p>

    <Plot grid>
        <Area data={aapl} x1="Date" y1={0} y2="Close" opacity={0.25} />
        <Line data={aapl} x="Date" y="Close" />
        <RuleY data={[0]} />
    </Plot>

    <Code code={`<Plot grid>
    <Area data={aapl} x1="Date" y1={0} y2="Close" opacity={0.25} />
    <Line data={aapl} x="Date" y="Close" />
    <RuleY data={[0]} />
</Plot>`} />

    <p>Typically, you won't want to use the <b>Area</b> mark directly, but want to use <b>AreaY</b> for "horizontal" area charts, where the time axis going from left to right:</p>

    <Plot>
        <AreaY data={aapl} x="Date" y="Close" />
    </Plot>

    <Code code={`<Plot>
    <AreaY data={aapl} x="Date" y="Close" />
</Plot>`} />

    <p>If you need a different baseline you can pass <b>y1</b> and <b>y2</b> channels instead of <b>y</b>:</p>

    <Plot grid>
        <AreaY data={aapl} x="Date" y1={100} y2="Close" />
    </Plot>

    <Code code={`<Plot grid>
    <AreaY data={aapl} x="Date" y1={100} y2="Close"  />
</Plot>`} />

    <p>For "vertical" area charts you can use the <b>AreaX</b> as shorthand</p>

    <Plot grid height={600} maxWidth="300px">
        <AreaX data={aapl} y="Date" x="Close" />
    </Plot>
</div>
