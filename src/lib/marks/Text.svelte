<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext, type Snippet } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';

    let { data, ...options } = $props<
        BaseMarkProps & {
            data: DataRecord[];
            x: ChannelAccessor;
            y: ChannelAccessor;
            fill?: ChannelAccessor;
            stroke?: ChannelAccessor;
            children?: Snippet;
            dx?: ConstantAccessor<number>;
            dy?: ConstantAccessor<number>;
            text: ConstantAccessor<string>;
            title: ConstantAccessor<string>;
            /**
             * the line anchor for vertical position; top, bottom, or middle
             */
            lineAnchor?: ConstantAccessor<'bottom' | 'top' | 'middle'>;
        }
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    const LINE_ANCHOR = {
        bottom: 'auto',
        middle: 'central',
        top: 'hanging'
    };

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="text"
    required={['x', 'y']}
    channels={[
        'x',
        'y',
        'r',
        'fx',
        'fy',
        'symbol',
        'fill',
        'stroke',
        'opacity',
        'strokeOpacity',
        'fillOpacity'
    ]}
    {data}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="text" data-use-x={useScale.x ? 1 : 0}>
        {#each data as datum}
            {#if testFacet(datum, mark.options) && (options.filter == null || resolveProp(options.filter, datum))}
                {@const _x = resolveChannel('x', datum, options)}
                {@const _y = resolveChannel('y', datum, options)}
                {@const title = resolveProp(options.title, datum, '')}
                {#if isValid(_x) && isValid(_y)}
                    {@const x = useScale.x
                        ? plot.scales.x.fn(_x) +
                          (plot.scales.x.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)
                        : _x}
                    {@const y = useScale.y
                        ? plot.scales.y.fn(_y) +
                          (plot.scales.y.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)
                        : _y}
                    {@const dx = +resolveProp(options.dx, datum, 0)}
                    {@const dy = +resolveProp(options.dy, datum, 0)}
                    <text
                        style={resolveScaledStyles(datum, options, useScale, plot, 'fill')}
                        dominant-baseline={LINE_ANCHOR[
                            resolveProp(options.lineAnchor, datum, 'middle') || 'middle'
                        ]}
                        transform="translate({[x + dx, y + dy]})"
                        >{resolveProp(options.text, datum, '')}{#if title}<title>{title}</title
                            >{/if}</text
                    >
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    text {
        text-anchor: middle;
        fill: none;
        stroke: none;
        font-size: 12px;
        font-weight: 500;
        stroke-width: 1.6px;
        paint-order: stroke fill;
    }
</style>
