<!-- 
    @component
    The FacetAxes component renders the facet axes
-->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { PlotContext} from '../types.js';
    import { scaleBand } from 'd3-scale';
    import BaseAxisX from '../marks/helpers/BaseAxisX.svelte';
    import BaseAxisY from '../marks/helpers/BaseAxisY.svelte';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    // we need the plot context for the overall width & height
    let plot = $derived(getPlotState());

    let useFacetX = $derived(plot.scales.fx.domain.length > 0);
    let useFacetY = $derived(plot.scales.fy.domain.length > 0);

    let fxValues = $derived(useFacetX ? plot.scales.fx.domain : [true]);
    let fyValues = $derived(useFacetY ? plot.scales.fy.domain : [true]);

    // create band scales for fx and fy
    let facetXScale = $derived(
        scaleBand().paddingInner(0.1).domain(fxValues).rangeRound([0, plot.plotWidth])
    );
    let facetYScale = $derived(
        scaleBand().paddingInner(0.1).domain(fyValues).rangeRound([0, plot.plotHeight])
    );
</script>

<!-- facet grid -->
{#if fxValues.length > 1 && plot.options.fx.axis}
    <g transform="translate({plot.options.marginLeft}, 0)">
        <BaseAxisX
            scaleFn={facetXScale}
            scaleType="band"
            ticks={fxValues}
            tickFormat={(d) => d}
            tickSize={0}
            tickPadding={5}
            anchor={plot.options.fx.axis}
            options={{}}
            height={plot.plotHeight}
            marginTop={plot.options.marginTop}
            {plot} />
    </g>
{/if}
{#if fyValues.length > 1 && plot.options.fy.axis}
    <g transform="translate(0, {plot.options.marginTop})">
        <BaseAxisY
            scaleFn={facetYScale}
            scaleType="band"
            ticks={fyValues}
            tickFormat={(d) => d}
            tickSize={0}
            tickPadding={5}
            anchor={plot.options.fy.axis}
            lineAnchor="center"
            options={{ dx: 0, dy: 0 }}
            width={plot.plotWidth}
            marginLeft={plot.options.marginLeft}
            {plot} />
    </g>
{/if}
