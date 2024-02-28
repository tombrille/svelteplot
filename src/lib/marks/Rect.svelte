<!--
    @component
    For arbitrary rectangles, requires quantitative x and y scales 
-->
<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { recordizeY, intervalX, intervalY } from '$lib/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales } from '../helpers/scales.js';
    import { coalesce, testFilter } from '../helpers/index.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        RectMarkProps,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { wrapEvent } from '../helpers/wrapEvent.js';

    type Props = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        interval?: number | string;
    } & RectMarkProps;

    let { data, onclick, onmouseenter, onmouseleave, ...options } = $props<Props>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(
        intervalY(intervalX(recordizeY<Props>({ data, ...options }), { plot }), { plot }) as Props
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="rect"
    required={[]}
    channels={[
        'x1',
        'x2',
        'y1',
        'y2',
        'fx',
        'fy',
        'fill',
        'stroke',
        'opacity',
        'fillOpacity',
        'strokeOpacity'
    ]}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g class="rect" data-fill={useScale.fillOpacity}>
        {#each args.data as datum}
            {#if testFilter(datum, args) && testFacet(datum, mark.options)}
                {@const x1_ = resolveChannel('x1', datum, args)}
                {@const x2_ = resolveChannel('x2', datum, args)}
                {@const y1_ = resolveChannel('y1', datum, args)}
                {@const y2_ = resolveChannel('y2', datum, args)}
                {@const x1 =
                    x1_ == null
                        ? plot.options.marginLeft
                        : useScale.x1
                          ? plot.scales.x.fn(x1_)
                          : x1_}
                {@const x2 =
                    x2_ == null
                        ? plot.options.marginLeft + plot.facetWidth
                        : useScale.x2
                          ? plot.scales.x.fn(x2_)
                          : x2_}
                {@const y1 =
                    y1_ == null
                        ? plot.options.marginTop
                        : useScale.y1
                          ? plot.scales.y.fn(y1_)
                          : y1_}
                {@const y2 =
                    y2_ == null
                        ? plot.options.marginTop + plot.facetHeight
                        : useScale.y2
                          ? plot.scales.y.fn(y2_)
                          : y2_}

                {@const miny = Math.min(y1, y2)}
                {@const maxy = Math.max(y1, y2)}
                {@const minx = Math.min(x1, x2)}
                {@const maxx = Math.max(x1, x2)}
                {@const inset = resolveProp(args.inset, datum, 0)}
                {@const insetLeft = resolveProp(args.insetLeft, datum)}
                {@const insetRight = resolveProp(args.insetRight, datum)}
                {@const insetTop = resolveProp(args.insetTop, datum)}
                {@const insetBottom = resolveProp(args.insetBottom, datum)}
                {@const dx = resolveProp(args.dx, datum, 0)}
                {@const dy = resolveProp(args.dy, datum, 0)}
                {@const insetL = coalesce(insetLeft, inset) || 0}
                {@const insetT = coalesce(insetTop, inset) || 0}
                {@const insetR = coalesce(insetRight, inset) || 0}
                {@const insetB = coalesce(insetBottom, inset) || 0}
                <g data-x2={x2_} data-x2s={plot.scales.x.fn(+x2_)} />
                {#if isValid(x1) && isValid(x2) && isValid(y1) && isValid(y2)}
                    <rect
                        style={resolveScaledStyles(datum, args, useScale, plot, 'fill')}
                        transform="translate({[minx + insetL + dx, miny + insetT + dy]})"
                        width={maxx - minx - insetL - insetR}
                        height={maxy - miny - insetT - insetB}
                        role={onclick ? 'button' : null}
                        rx={resolveProp(args.rx, datum, null)}
                        ry={resolveProp(args.ry, datum, null)}
                        onclick={onclick && wrapEvent(onclick, datum)}
                        onmouseenter={onmouseenter && wrapEvent(onmouseenter, datum)}
                        onmouseleave={onmouseleave && wrapEvent(onmouseleave, datum)}
                    />
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    rect {
        stroke: none;
        /* fill: none; */
    }
</style>
