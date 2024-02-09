<script lang="ts">
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { PlotContext, GenericMarkOptions, Mark } from './types.js';
    import { scaleBand } from 'd3-scale';
    import Facet from './Facet.svelte';

    const { getPlotState, updateDimensions } = getContext<PlotContext>('svelteplot');
    // we need the plot context for the overall width & height
    let plot = $derived(getPlotState());

    let { children, marks } = $props<{
        children: Snippet;
        marks: Mark<GenericMarkOptions>[];
    }>();

    let facetXValues = $derived(plot.scales.fx.domain.length ? plot.scales.fx.domain : [true]);
    let facetYValues = $derived(plot.scales.fy.domain.length ? plot.scales.fy.domain : [true]);

    // create band scales for fx and fy
    let facetXScale = $derived(scaleBand().padding(0.2).domain(facetXValues).range([plot.options.marginLeft, plot.options.marginLeft + plot.plotWidth]));
    let facetYScale = $derived(scaleBand().padding(0.2).domain(facetYValues).range([plot.options.marginTop, plot.options.marginTop + plot.plotHeight]));

    function mutateScaleRange(scale, range) {
        return {
            ...scale,
            range,
            fn: scale.fn.copy().range(range)
        }
    }

    $effect(() => {
        updateDimensions(
            facetXScale.bandwidth(),
            facetYScale.bandwidth(),
        );
    });
</script>

{#each facetXValues as facetX}
    {#each facetYValues as facetY}
        <g transform="translate({facetXScale(facetX)}, {facetYScale(facetY)})">
            <Facet fx={facetX} fy={facetY}>
            {@render children()}
            </Facet>
        </g>
    {/each}
{/each}
