<script lang="ts">
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { PlotContext, GenericMarkOptions, Mark } from './types.js';
    import { scaleBand } from 'd3-scale';
    import Facet from './Facet.svelte';
    import BaseAxisX from './marks/helpers/BaseAxisX.svelte';

    const { getPlotState, updateDimensions } = getContext<PlotContext>('svelteplot');
    // we need the plot context for the overall width & height
    let plot = $derived(getPlotState());

    let { children, marks } = $props<{
        children: Snippet;
        marks: Mark<GenericMarkOptions>[];
    }>();

    let useFacetX = $derived(plot.scales.fx.domain.length > 0);
    let useFacetY = $derived(plot.scales.fy.domain.length > 0);

    let facetXValues = $derived(useFacetX ? plot.scales.fx.domain : [true]);
    let facetYValues = $derived(useFacetY ? plot.scales.fy.domain : [true]);

    // create band scales for fx and fy
    let facetXScale = $derived(
        scaleBand().paddingInner(0.1).domain(facetXValues).rangeRound([0, plot.plotWidth])
    );
    let facetYScale = $derived(
        scaleBand().paddingInner(0.1).domain(facetYValues).rangeRound([0, plot.plotHeight])
    );

    // setContext('facet', { getFacetState() { return {} }})

    $effect(() => {
        updateDimensions(
            useFacetX ? facetXScale.bandwidth() : plot.plotWidth,
            useFacetY ? facetYScale.bandwidth() : plot.plotHeight
        );
    });
</script>

{#if facetXValues.length > 1}
    <g transform="translate({plot.options.marginLeft}, 0)">
        <BaseAxisX
            scaleFn={facetXScale}
            scaleType="band"
            ticks={facetXValues}
            tickFormat={(d) => d}
            tickSize={4}
            tickPadding={5}
            anchor="top"
            options={{}}
            height={plot.plotHeight}
            marginTop={plot.options.marginTop}
            {plot}
        />
    </g>
{/if}

{#each facetXValues as facetX, i}
    {#each facetYValues as facetY, j}
        <g
            class="facet"
            transform="translate({useFacetX ? facetXScale(facetX) : 0}, {useFacetY
                ? facetYScale(facetY)
                : 0})"
        >
            <Facet
                fx={facetX}
                fy={facetY}
                firstX={i === 0}
                lastX={i === facetXValues.length - 1}
                firstY={j === 0}
                lastY={j === facetYValues.length - 1}
            >
                {@render children()}
            </Facet>
        </g>
    {/each}
{/each}
