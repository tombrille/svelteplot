<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Mark from '../Mark.svelte';
    import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import { getContext } from 'svelte';
    import { recordizeY } from '$lib/transforms/recordize.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales } from '../helpers/scales.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';

    type RuleYOptions = BaseMarkProps & {
        data: DataRecord[];
        y?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        inset?: ConstantAccessor<number>;
        insetLeft?: ConstantAccessor<number>;
        insetRight?: ConstantAccessor<number>;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
    };

    let { data, ...options } = $props<RuleYOptions>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(recordizeY<RuleYOptions>({ data, ...options }, { withIndex: false }));
</script>

<Mark
    type="ruleY"
    channels={['y', 'x1', 'x2', 'stroke', 'opacity', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}

    <GroupMultiple class="rule-y" count={args.data.length}>
        {#each args.data as datum}
            {@const y_ = resolveChannel('y', datum, args)}
            {#if isValid(y_)}
                {@const x1_ = resolveChannel('x1', datum, args)}
                {@const x2_ = resolveChannel('x2', datum, args)}
                {@const       y = (useScale.y ? plot.scales.y.fn(y_) : y_) as number}
                {@const       x1 = (useScale.x1 ? plot.scales.y.fn(x1_) : x1_) as number}
                {@const       x2 = (useScale.x2 ? plot.scales.y.fn(x2_) : x2_) as number}
                {@const stroke_ = resolveChannel('stroke', datum, args)}
                {@const       stroke = (useScale.stroke ? plot.scales.color.fn(stroke_) : stroke_) as string}
                {@const       inset = resolveProp(args.inset, datum as DataRecord, 0) as number}
                {@const       insetLeft = resolveProp(args.insetLeft, datum as DataRecord, 0) as number}
                {@const       insetRight = resolveProp(args.insetRight, datum as DataRecord, 0) as number}
                {@const       dx = resolveProp(args.dx, datum as DataRecord, 0) as number}
                {@const       dy = resolveProp(args.dy, datum as DataRecord, 0) as number}
                <line
                    transform="translate({dx}, {y + dy})"
                    style={resolveScaledStyles(datum, args, useScale, plot, 'stroke')}
                    x1={(inset || insetLeft) + (x1_ != null ? x1 : plot.options.marginLeft)}
                    x2={(x2_ != null ? x2 : plot.facetWidth + plot.options.marginLeft) -
                        (inset || insetRight)}
                />
            {/if}
        {/each}
    </GroupMultiple>
</Mark>

<style>
</style>
