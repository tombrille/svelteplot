<script lang="ts">
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { PlotContext, GenericMarkOptions, Mark, RawValue } from './types.js';
    import { scaleBand } from 'd3-scale';
    import Facet from './Facet.svelte';
    import BaseAxisX from './marks/helpers/BaseAxisX.svelte';
    import BaseAxisY from './marks/helpers/BaseAxisY.svelte';
    import { getEmptyFacets } from './helpers/facets.js';

    const { getPlotState, updateDimensions } = getContext<PlotContext>('svelteplot');
    // we need the plot context for the overall width & height
    let plot = $derived(getPlotState());

    let { children, marks } = $props<{
        children: Snippet;
        marks: Mark<GenericMarkOptions>[];
    }>();

    let useFacetX = $derived(plot.scales.fx.domain.length > 0);
    let useFacetY = $derived(plot.scales.fy.domain.length > 0);

    let fxValues = $derived(useFacetX ? plot.scales.fx.domain : [true]);
    let fyValues = $derived(useFacetY ? plot.scales.fy.domain : [true]);

    // we need to track which facets are "empty", meaning that they don't contain
    // any "faceted" data points. this can happen when fx and fy are combined and
    // certain combinations don't yield results
    let emptyFacets = $derived(getEmptyFacets(marks, fxValues, fyValues));

    // create band scales for fx and fy
    let facetXScale = $derived(
        scaleBand().paddingInner(0.1).domain(fxValues).rangeRound([0, plot.plotWidth])
    );
    let facetYScale = $derived(
        scaleBand().paddingInner(0.1).domain(fyValues).rangeRound([0, plot.plotHeight])
    );

    $effect(() => {
        updateDimensions(
            useFacetX ? facetXScale.bandwidth() : plot.plotWidth,
            useFacetY ? facetYScale.bandwidth() : plot.plotHeight
        );
    });
</script>

<!-- facet grid -->
{#if fxValues.length > 1}
    <g transform="translate({plot.options.marginLeft}, 0)">
        <BaseAxisX
            scaleFn={facetXScale}
            scaleType="band"
            ticks={fxValues}
            tickFormat={(d) => d}
            tickSize={0}
            tickPadding={5}
            anchor="top"
            options={{}}
            height={plot.plotHeight}
            marginTop={plot.options.marginTop}
            {plot}
        />
    </g>
{/if}
{#if fyValues.length > 1}
    <g transform="translate(0, {plot.options.marginTop})">
        <BaseAxisY
            scaleFn={facetYScale}
            scaleType="band"
            ticks={fyValues}
            tickFormat={(d) => d}
            tickSize={0}
            tickPadding={5}
            anchor="right"
            lineAnchor="center"
            options={{ dx: 0, dy: 0 }}
            width={plot.plotWidth}
            marginLeft={plot.options.marginLeft}
            {plot}
        />
    </g>
{/if}

{#each fxValues as facetX, i}
    {#each fyValues as facetY, j}
        <g
            class="facet"
            style:display={emptyFacets.get(facetX)?.get(facetY) ? 'none' : 'block'}
            transform="translate({useFacetX ? facetXScale(facetX) : 0}, {useFacetY
                ? facetYScale(facetY)
                : 0})"
        >
            <Facet
                fx={facetX}
                fy={facetY}
                left={i === 0}
                right={i === fxValues.length - 1}
                top={j === 0}
                bottom={j === fyValues.length - 1}
                leftEmpty={!!(i === 0 || emptyFacets.get(fxValues[i - 1])?.get(facetY))}
                topEmpty={!!(j === 0 || emptyFacets.get(facetX)?.get(fyValues[j - 1]))}
                rightEmpty={!!(
                    i === fxValues.length - 1 || emptyFacets.get(fxValues[i + 1])?.get(facetY)
                )}
                bottomEmpty={!!(
                    j === fyValues.length - 1 || emptyFacets.get(facetX)?.get(fyValues[j + 1])
                )}
            >
                {@render children()}
            </Facet>
        </g>
    {/each}
{/each}
