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
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { testFilter } from '$lib/helpers/index.js';

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

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="ruleY"
    channels={['y', 'x1', 'x2', 'fx', 'fy', 'stroke', 'opacity', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}

    <GroupMultiple class="rule-y" count={args.data.length}>
        {#each args.data as datum}
            {#if testFacet(datum, mark.options) && testFilter(datum, mark.options)}
                {@const y_ = resolveChannel('y', datum, args)}
                {#if isValid(y_)}
                    {@const x1_ = resolveChannel('x1', datum, args)}
                    {@const x2_ = resolveChannel('x2', datum, args)}
                    {@const y = useScale.y ? plot.scales.y.fn(y_) : y_}
                    {@const x1 = useScale.x1 ? plot.scales.y.fn(x1_) : x1_}
                    {@const x2 = useScale.x2 ? plot.scales.y.fn(x2_) : x2_}
                    {@const inset = resolveProp(args.inset, datum, 0)}
                    {@const insetLeft = resolveProp(args.insetLeft, datum, 0)}
                    {@const insetRight = resolveProp(args.insetRight, datum, 0)}
                    {@const dx = resolveProp(args.dx, datum, 0)}
                    {@const dy = resolveProp(args.dy, datum, 0)}
                    <line
                        transform="translate({dx}, {y + dy})"
                        style={resolveScaledStyles(datum, args, useScale, plot, 'stroke')}
                        x1={(inset || insetLeft) + (x1_ != null ? x1 : plot.options.marginLeft)}
                        x2={(x2_ != null ? x2 : plot.facetWidth + plot.options.marginLeft) -
                            (inset || insetRight)}
                    />
                {/if}
            {/if}
        {/each}
    </GroupMultiple>
</Mark>

<style>
</style>
