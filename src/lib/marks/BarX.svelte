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
    import { stackX, recordizeX, intervalX } from '$lib/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        RectMarkProps,
        ChannelAccessor
    } from '../types.js';
    import { wrapEvent } from '../helpers/wrapEvent.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type { DataRow } from '$lib/types.js';
    import { isValid, testFilter } from '$lib/helpers/index.js';

    type BarXProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
        stack?: StackOptions;
    } & RectMarkProps;

    let { data, stack, onclick, onmouseenter, onmouseleave, ...options } = $props<BarXProps>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(stackX(intervalX(recordizeX({ data, ...options }), { plot }), stack));
</script>

<Mark
    type="barX"
    channels={['x1', 'x2', 'y', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}

    <g class="bars-x">
        {#each args.data as datum}
            {#if testFilter(datum, args)}
                {@const y_ = resolveChannel('y', datum, args)}
                {@const x1_ = resolveChannel('x1', datum, args)}
                {@const x2_ = resolveChannel('x2', datum, args)}
                {@const x1 = useScale.x1 ? projectX('x1', plot.scales, x1_) : x1_}
                {@const x2 = useScale.x2 ? projectX('x1', plot.scales, x2_) : x2_}
                {@const y = useScale.y ? projectY('y', plot.scales, y_) : y_}
                {@const minx = Math.min(x1, x2)}
                {@const maxx = Math.max(x1, x2)}
                {@const inset = resolveProp(args.inset, datum, 0)}
                {@const dx = resolveProp(args.dx, datum, 0)}
                {@const dy = resolveProp(args.dy, datum, 0)}
                {#if isValid(y) && isValid(x1) && isValid(x2)}
                    <rect
                        style={resolveScaledStyles(datum, args, useScale, plot, 'fill')}
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
            {/if}
        {/each}
    </g>
</Mark>
