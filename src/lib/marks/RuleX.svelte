<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { recordizeX } from '$lib/transforms/recordize.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { getUsedScales } from '../helpers/scales.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';

    type RuleXOptions = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        inset?: ConstantAccessor<number>;
        insetTop?: ConstantAccessor<number>;
        insetBottom?: ConstantAccessor<number>;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
    };

    let { data, ...options } = $props<RuleXOptions>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(recordizeX<RuleXOptions>({ data, ...options }, { withIndex: false }));
</script>

<Mark type="ruleX" channels={['x', 'y1', 'y2', 'stroke']} {...args} let:mark>
    {@const useScale = getUsedScales(plot, args, mark)}

    <g class="rule-x">
        {#each args.data as datum}
            {@const x_ = resolveChannel('x', datum, args)}
            {#if isValid(x_)}
                {@const y1_ = resolveChannel('y1', datum, args)}
                {@const y2_ = resolveChannel('y2', datum, args)}
                {@const          x = (useScale.x ? plot.scales.x.fn(x_) : x_) as number}
                {@const          y1 = (useScale.y1 ? plot.scales.y.fn(y1_) : y1_) as number}
                {@const          y2 = (useScale.y2 ? plot.scales.y.fn(y2_) : y2_) as number}
                {@const stroke_ = resolveChannel('stroke', datum, args)}
                {@const          stroke = (useScale.stroke ? plot.scales.color.fn(stroke_) : stroke_) as string}
                {@const          inset = resolveProp(args.inset, datum as DataRecord, 0) as number}
                {@const          insetTop = resolveProp(args.insetTop, datum as DataRecord, 0) as number}
                {@const          insetBottom = resolveProp(args.insetBottom, datum as DataRecord, 0) as number}
                {@const          dx = resolveProp(args.dx, datum as DataRecord, 0) as number}
                {@const          dy = resolveProp(args.dy, datum as DataRecord, 0) as number}
                <line
                    transform="translate({x + dx}, {dy})"
                    style={getBaseStyles(datum, args)}
                    style:stroke={stroke_ ? stroke : 'currentColor'}
                    y1={(inset || insetTop) + (y1_ != null ? y1 : plot.options.marginTop)}
                    y2={(y2_ != null ? y2 : plot.plotHeight + plot.options.marginTop) -
                        (inset || insetBottom)}
                />
            {/if}
        {/each}
    </g>
</Mark>

<style>
</style>
