<script lang="ts">
    import { Figure, Frame, Line, RuleX, RuleY } from '$lib';
    import Dot from '$lib/marks/Dot.svelte';
    import GridX from '$lib/marks/GridX.svelte';
    import GridY from '$lib/marks/GridY.svelte';
    import type { Datasets } from '$lib/types';
    import { range } from 'd3-array';
    import { getContext } from 'svelte';
    import dayjs from 'dayjs';

    const { aapl } = getContext<Datasets>('data');

    type AAPL = (typeof aapl)[0];
</script>

<h1 class="title">Rules</h1>

<p>A common use case for rules are axis lines or value annotations:</p>

<code
    ><pre>{`<Figure>
    <GridX />
    <GridY />
    <RuleY data={[56]} stroke="turquoise" strokeWidth="3" />
    <RuleY data={[0]} />
    <RuleX data={[new Date(2016, 0, 1)]} stroke="red" />
    <Line data={aapl} x="Date" y="Close" />
</Figure>`}
    </pre></code
>

<Figure>
    <GridX />
    <GridY />
    <RuleY data={[56]} stroke="turquoise" strokeWidth="3" />
    <RuleY data={[0]} />
    <RuleX data={[new Date(2016, 0, 1)]} stroke="red" />
    <Line data={aapl} x="Date" y="Close" />
</Figure>

Rules can be used for showing data, too:

<Figure>
    <GridX />
    <GridY />
    <RuleX
        data={aapl}
        x="Date"
        y1="Open"
        y2="Close"
        strokeWidth="2"
        stroke={(d) => ((d as AAPL).Close > (d as AAPL).Open ? 'green' : 'red')}
    />
</Figure>

Or just some generated numbers

<Figure let:figure>
    <GridX
        data={range(0, 3.01, 0.5).map((d) => d * Math.PI)}
        tickFormat={(d) => `${Number(d) / Math.PI}π`}
    />
    <GridY />
    <RuleY data={[0]} />
    <RuleX
        data={range(0, Math.PI * 3, 0.1)}
        y1={0}
        y2={(d) => Math.sin(Number(d))}
        stroke="teal"
        strokeOpacity="0.8"
        strokeWidth={figure.plotWidth / 100 + 0.5}
    />
</Figure>
