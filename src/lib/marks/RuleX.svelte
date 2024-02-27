<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { recordizeX } from '$lib/transforms/recordize.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales } from '../helpers/scales.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor
    } from '../types.js';
    import { isValid, testFilter } from '../helpers/index.js';

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

    const { getTestFacet } = getContext('facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="ruleX"
    channels={['x', 'y1', 'y2', 'fx', 'fy', 'stroke', 'opacity', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}

    <g class="rule-x">
        {#each args.data as datum}
            {#if testFacet(datum, mark.options) && testFilter(datum, mark.options)}
                {@const x_ = resolveChannel('x', datum, args)}
                {#if isValid(x_)}
                    {@const y1_ = resolveChannel('y1', datum, args)}
                    {@const y2_ = resolveChannel('y2', datum, args)}
                    {@const x = useScale.x ? plot.scales.x.fn(x_) : x_}
                    {@const y1 = useScale.y1 ? plot.scales.y.fn(y1_) : y1_}
                    {@const y2 = useScale.y2 ? plot.scales.y.fn(y2_) : y2_}
                    {@const inset = resolveProp(args.inset, datum, 0)}
                    {@const insetTop = resolveProp(args.insetTop, datum, 0)}
                    {@const insetBottom = resolveProp(args.insetBottom, datum, 0)}
                    {@const dx = resolveProp(args.dx, datum, 0)}
                    {@const dy = resolveProp(args.dy, datum, 0)}
                    <line
                        transform="translate({x + dx}, {dy})"
                        style={resolveScaledStyles(datum, args, useScale, plot, 'stroke')}
                        y1={(inset || insetTop) + (y1_ != null ? y1 : plot.options.marginTop)}
                        y2={(y2_ != null ? y2 : plot.facetHeight + plot.options.marginTop) -
                            (inset || insetBottom)}
                    />
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
</style>
