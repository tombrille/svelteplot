<!--
    @component
    For arbitrary rectangles, requires band x and y scales 
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
        ChannelAccessor
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { wrapEvent } from '../helpers/wrapEvent.js';

    type Props = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    } & RectMarkProps;

    let { data, onclick, onmouseenter, onmouseleave, ...options } = $props<Props>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(recordizeY<Props>({ data, ...options }) as Props);

    const { getTestFacet } = getContext('facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="cell"
    required={['x', 'y']}
    channels={['x', 'y', 'fx', 'fy', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g class="rect" data-fill={useScale.fillOpacity}>
        {#each args.data as datum}
            {#if testFilter(datum, args) && testFacet(datum, mark.options)}
                {@const x_ = resolveChannel('x', datum, args)}
                {@const y_ = resolveChannel('y', datum, args)}
                {@const  x1 = (useScale.x ? plot.scales.x.fn(x_) : x_) as number}
                {@const  x2 = (x1 + plot.scales.x.fn.bandwidth()) as number}
                {@const  y1 = (useScale.y ? plot.scales.y.fn(y_) : y_) as number}
                {@const  y2 = (y1 + plot.scales.y.fn.bandwidth()) as number}

                {@const  miny = Math.min(y1 as number, y2 as number)}
                {@const  maxy = Math.max(y1 as number, y2 as number)}
                {@const  minx = Math.min(x1 as number, x2 as number)}
                {@const  maxx = Math.max(x1 as number, x2 as number)}
                {@const  inset = resolveProp(args.inset, datum as DataRecord, 0) as number}
                {@const  insetLeft = resolveProp(args.insetLeft, datum as DataRecord) as number}
                {@const  insetRight = resolveProp(args.insetRight, datum as DataRecord) as number}
                {@const  insetTop = resolveProp(args.insetTop, datum as DataRecord) as number}
                {@const  insetBottom = resolveProp(args.insetBottom, datum as DataRecord) as number}
                {@const  dx = resolveProp(args.dx, datum as DataRecord, 0) as number}
                {@const  dy = resolveProp(args.dy, datum as DataRecord, 0) as number}
                {@const insetL = coalesce(insetLeft, inset) || 0}
                {@const insetT = coalesce(insetTop, inset) || 0}
                {@const insetR = coalesce(insetRight, inset) || 0}
                {@const insetB = coalesce(insetBottom, inset) || 0}

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
