<script lang="ts">
    import { getContext } from 'svelte';
    import type { DataRecord, PlotContext, BaseMarkProps } from '../types.js';
    import Mark from '../Mark.svelte';
    import { geoPath } from 'd3-geo';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '$lib/helpers/resolve.js';
    import { getUsedScales } from '$lib/helpers/scales.js';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { sort } from '$lib/index.js';
    import { isObject, testFilter } from '$lib/helpers/index.js';
    import { addEvents } from './helpers/events.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let { data, geoType, dragRotate, ...options } = $props<
        {
            data: DataRecord[];
            geoType: string;
            dragRotate: boolean;
        } & BaseMarkProps
    >();

    let path = $derived(
        callWithProps(geoPath, [plot.scales.projection], {
            ...(options.r
                ? { pointRadius: (d) => plot.scales.r.fn(resolveChannel('r', d, options)) }
                : { pointRadius: 3 })
        })
    );

    let args = $derived(
        sort({
            data: data.map((d) => (isObject(d) ? d : { ___orig___: d })),
            ...(options.r ? { sort: { channel: '-r' } } : {}),
            ...options
        })
    );
    const preferStroke = new Set(['MultiLineString', 'LineString']);
</script>

<Mark
    type="geo"
    channels={['fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity', 'r']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g aria-label="geo" class="geo{geoType ? ` geo-${geoType}` : ''}" style="fill:currentColor">
        {#each args.data as datum}
            {#if testFilter(datum, mark.options)}
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
                        use:addEvents={{ options: mark.options, datum }}
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
