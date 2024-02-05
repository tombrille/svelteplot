<!--
    @component
    For horizontal bar charts using a band scale as y axis
-->
<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { stackX, recordizeX } from '$lib/index.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { getUsedScales } from '../helpers/scales.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkStyleProps,
        RectMarkProps,
        ChannelAccessor
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { wrapEvent } from '../helpers/wrapEvent.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type { DataRow } from '$lib/types.js';

    type BarXProps = BaseMarkStyleProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
        stack?: StackOptions;
    } & RectMarkProps;

    let { data, stack, onclick, onmouseenter, onmouseleave, ...options } = $props<BarXProps>();

    let args = $derived(stackX(recordizeX({ data, ...options }), stack));

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());
</script>

<Mark type="barX" channels={['x1', 'x2', 'y', 'fill', 'stroke', 'opacity']} {...args} let:mark>
    {@const useScale = getUsedScales(plot, args, mark)}

    <g class="bars-x">
        {#each args.data as datum}
            {@const y_ = resolveChannel('y', datum, args)}
            {@const x1_ = resolveChannel('x1', datum, args)}
            {@const x2_ = resolveChannel('x2', datum, args)}
            {@const x1 = (useScale.x1 ? plot.scales.x.fn(x1_ as number) : x1_) as number}
            {@const x2 = (useScale.x2 ? plot.scales.x.fn(x2_) : x2_) as number}
            {@const y = (useScale.y ? plot.scales.y.fn(y_) : y_) as number}
            {@const minx = Math.min(x1 as number, x2 as number)}
            {@const maxx = Math.max(x1 as number, x2 as number)}
            {@const fill_ = resolveChannel('fill', datum, args)}
            {@const stroke_ = resolveChannel('stroke', datum, args)}
            {@const fill = (useScale.fill ? plot.scales.color.fn(fill_) : fill_) as string}
            {@const stroke = (useScale.stroke ? plot.scales.color.fn(stroke_) : stroke_) as string}
            {@const inset = resolveProp(args.inset, datum as DataRecord, 0) as number}
            {@const dx = resolveProp(args.dx, datum as DataRecord, 0) as number}
            {@const dy = resolveProp(args.dy, datum as DataRecord, 0) as number}
            {#if isValid(y) && isValid(x1) && isValid(x2)}
                <rect
                    style={getBaseStyles(datum, args)}
                    style:fill={fill_ ? fill : stroke_ ? null : 'currentColor'}
                    style:stroke={stroke_ ? stroke : null}
                    transform="translate({[minx + dx, y + inset + dy]})"
                    width={maxx - minx}
                    height={plot.scales.y.fn.bandwidth() - inset * 2}
                    role={onclick ? 'button' : null}
                    rx={resolveProp(args.rx, datum, null)}
                    ry={resolveProp(args.ry, datum, null)}
                    onclick={onclick && wrapEvent(onclick, datum)}
                    onmouseenter={onmouseenter && wrapEvent(onmouseenter, datum)}
                    onmouseleave={onmouseleave && wrapEvent(onmouseleave, datum)}
                />
            {/if}
        {/each}
    </g>
</Mark>

<style>
    rect {
        stroke: none;
        fill: none;
    }
</style>
