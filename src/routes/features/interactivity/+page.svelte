<script lang="ts">
    import { Plot } from '$lib';
    import { getContext } from 'svelte';
    import type { Datasets } from '$lib/types.js';
    import Dot from '$lib/marks/Dot.svelte';

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

<h1 class="title">Interactivity</h1>

<p>By default SveltePlot will create axis marks automatically:</p>

<Plot grid y={{ log: true }} onmousemove={onMouseMove}>
    <Line data={aapl} x="Date" y="Close" />
    {#if nearestDataPoint}
        <Dot fill="black" r={4} data={[nearestDataPoint]} x="Date" y="Close" />
    {/if}
</Plot>
