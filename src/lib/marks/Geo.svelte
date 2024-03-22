<script lang="ts">
    import { getContext } from 'svelte';
    import type { DataRecord, PlotContext, BaseMarkProps } from '../types.js';
    import Mark from '../Mark.svelte';
    import { geoPath } from 'd3-geo';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '$lib/helpers/resolve.js';
    import { getUsedScales } from '$lib/helpers/scales.js';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { sort } from '$lib/index.js';
    import { testFilter } from '$lib/helpers/index.js';
    import { addEventHandlers } from './helpers/events.js';
    import { facetWrap } from '$lib/transforms/facet.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    type GeoMarkProps = {
        data: DataRecord[];
        geoType?: 'sphere' | 'graticule';
        dragRotate: boolean;
    } & BaseMarkProps;

    let { data, geoType, dragRotate, ...options }: GeoMarkProps = $props();

    let path = $derived(
        callWithProps(geoPath, [plot.scales.projection], {
            ...(options.r
                ? { pointRadius: (d) => plot.scales.r.fn(resolveChannel('r', d, options)) }
                : { pointRadius: 3 })
        })
    );

    let args = $derived(
        facetWrap(
            sort({
                data,
                ...(options.r ? { sort: { channel: '-r' } } : {}),
                ...options
            })
        )
    );
    const preferStroke = new Set(['MultiLineString', 'LineString']);

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="geo"
    channels={['fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity', 'r', 'fx', 'fy', 'fz']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g aria-label="geo" class="geo{geoType ? ` geo-${geoType}` : ''}" style="fill:currentColor">
        {#each args.data as datum}
            {#if testFilter(datum, mark.options) && testFacet(datum, mark.options)}
                {#snippet el(datum)}
                    {@const title = resolveProp(args.title, datum, '')}
                    {@const geometry = resolveProp(args.geometry, datum, datum)}
                    <path
                        d={path(geometry)}
                        style={resolveScaledStyles(
                            datum,
                            args,
                            useScale,
                            plot,
                            preferStroke.has(geometry.type) ? 'stroke' : 'fill'
                        )}
                        use:addEventHandlers={{ scales: plot.scales, options: mark.options, datum }}
                    >
                        {#if title}<title>{title}</title>{/if}
                    </path>
                {/snippet}
                {#if options.href}
                    <a
                        href={resolveProp(args.href, datum, '')}
                        target={resolveProp(args.target, datum, '_self')}
                    >
                        {@render el(datum)}
                    </a>
                {:else}
                    {@render el(datum)}
                {/if}
            {/if}
        {/each}
    </g>
</Mark>
