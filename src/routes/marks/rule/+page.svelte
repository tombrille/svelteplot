<script lang="ts">
    import { Plot, Frame, Line, RuleX, RuleY } from '$lib/index.js';
    import Dot from '$lib/marks/Dot.svelte';
    import GridX from '$lib/marks/GridX.svelte';
    import GridY from '$lib/marks/GridY.svelte';
    import type { Datasets } from '$lib/types.js';
    import { range } from 'd3-array';
    import { getContext } from 'svelte';
    import dayjs from 'dayjs';
    import SineRules from './SineRules.svelte';
    import CandlestickExample from './CandlestickExample.svelte';
    import { randomNormal } from 'd3-random';
    import Code from '../../Code.svelte';

    const { aapl } = getContext<Datasets>('data');

    type AAPL = (typeof aapl)[0];
</script>

<div class="content">
    <h1>Rules</h1>

    <p>A common use case for rules are axis lines or value annotations:</p>

    <Plot grid>
        <RuleY data={[90]} stroke="turquoise" strokeWidth="3" />
        <RuleX data={[new Date(2016, 4, 14)]} stroke="red" strokeWidth="3" opacity="0.5" />
        <Line data={aapl} x="Date" y="Close" />
        <RuleY data={[0]} />
    </Plot>

    <Code code={`<Plot grid>
        <RuleY data={[90]} stroke="turquoise" strokeWidth="3" />
        <RuleX data={[new Date(2016, 4, 14)]} stroke="red" strokeWidth="3" opacity="0.5" />
        <Line data={aapl} x="Date" y="Close" />
        <RuleY data={[0]} />
    </Plot>`} />

    <p class="block">
        By defining the <b>x</b>, <b>y1</b> and <b>y2</b> properties, rules can be used for showing data,
        too:
    </p>

    <CandlestickExample code />

    Or just some generated numbers

    <SineRules />

    <p><b>RuleY</b> mark can be used for barcode like charts:</p>

    <Plot>
        <RuleX data={range(500).map(randomNormal(0,1))} />
    </Plot>

    <Code code={`<scr${'ipt>'}
    import { Plot, RuleX } from 'svelteplot';
    import { randomNormal } from 'd3-random';
</scr${'ipt>'}
<Plot>
    <RuleX data={range(500).map(randomNormal(0,1))} />
</Plot>`} />
</div>