<script lang="ts">
    import { Plot, GridX, GridY, Line } from '$lib/index.js';
    import { getContext } from 'svelte';
    import type { Datasets } from '$lib/types.js';
    import Dot from '$lib/marks/Dot.svelte';
    import Code from '../../Code.svelte';

    const { aapl } = getContext<Datasets>('data');

    // let hoverX: Date|null = $state(null);
    let nearestDataPoint = $state<Datasets['aapl'][0] | null>(null);
    // $derived(hoverX ? aapl.slice(0).sort((a,b) => Math.abs(a.Date - hoverX) - Math.abs(b.Date - hoverX))[0] : null)

    function onMouseMove(evt) {
        // console.log(evt)
        const hoverX = evt.plot.xScale.invert(evt.layerX);
        let nearestPoint = null;
        let nearestPointDist = Number.MAX_VALUE;
        aapl.forEach((d) => {
            const dist = Math.abs(d.Date.getTime() - hoverX.getTime());
            if (dist < nearestPointDist) {
                nearestPointDist = dist;
                nearestPoint = d;
            }
        });
        nearestDataPoint = nearestPoint;
        // console.log(hoverX)
        // if (nearestDataPoint) console.log(nearestDataPoint.Date)
    }
</script>

<h1 class="title">Scales</h1>

<div class="content">
    <h2>Continuous scales</h2>

    <p>
        The domain of a quantitative scale is a continuous extent [min, max] where min and max are
        numbers, such as temperatures. Below, the first domain value (x = 0) corresponds to the left
        side of the plot while the second (x = 100) corresponds to the right side.
    </p>

    <Plot x={{ domain: [0, 100], grid: true }} />

    <Code code={`<Plot x={{ domain: [0,100], grid: true }} />`} />

    <p>Scales can be reversed using the <b>reverse</b> option:</p>

    <Plot x={{ domain: [0, 100], grid: true, reverse: true }} />

    <Code code={`<Plot x={{ domain: [0,100], grid: true, reverse: true }} />`} />

    <p>
        If the domain is dates, Plot will default to a UTC scale. This is a linear scale with ticks
        based on the Gregorian calendar.
    </p>

    <Plot x={{ domain: [new Date('2021-01-01'), new Date('2022-01-01')], grid: true }} />

    <Code
        code={`<Plot x={{ domain: [new Date('2021-01-01'), new Date('2022-01-01')], grid: true }} />`}
    />

    <h2>Logarithmic scales</h2>

    <p>
        The domain of a quantitative scale is a continuous extent [min, max] where min and max are
        numbers, such as temperatures. Below, the first domain value (x = 0) corresponds to the left
        side of the plot while the second (x = 100) corresponds to the right side.
    </p>

    <Plot x={{ domain: [0, 100], log: true, grid: true }} />

    <Code code={`<Plot x={{ domain: [0,100], log: true, grid: true }} />`} />
</div>

<p>By default SveltePlot will create axis marks automatically:</p>

<Plot grid y={{ log: true }} onmousemove={onMouseMove}>
    <Line data={aapl} x="Date" y="Close" />
    {#if nearestDataPoint}
        <Dot fill="black" r={4} data={[nearestDataPoint]} x="Date" y="Close" />
    {/if}
</Plot>
