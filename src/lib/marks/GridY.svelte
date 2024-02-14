<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext } from 'svelte';
    import Mark from '../Mark.svelte';
    import type { PlotContext, BaseMarkProps, RawValue, DataRecord } from '../types.js';
    import { resolveChannel, resolveScaledStyles } from '../helpers/resolve.js';
    import { autoTicks } from '$lib/helpers/autoTicks.js';
    import { getUsedScales } from '$lib/helpers/scales.js';

    let {
        data = [],
        automatic,
        ...options
    } = $props<{ data?: RawValue[]; automatic?: boolean } & BaseMarkProps>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let autoTickCount = $derived(
        Math.max(2, Math.round(plot.facetHeight / plot.options.y.tickSpacing))
    );

    let ticks: RawValue[] = $derived(
        data.length > 0
            ? // use custom tick values if user passed any as prop
              data
            : // use custom scale tick values if user passed any as plot scale option
              autoTicks(
                  plot.scales.y.type,
                  plot.options.y.ticks,
                  plot.options.y.interval,
                  plot.scales.y.domain,
                  plot.scales.y.fn,
                  autoTickCount
              )
    );
</script>

<Mark
    type="gridY"
    data={data.length ? data.map((tick) => ({ __y: tick })) as DataRecord[] : []}
    channels={['x1', 'x2', 'y', 'stroke', 'strokeOpacity']}
    {...{ ...options, y: '__y' }}
    {automatic}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="grid-x">
        {#each ticks as tick}
            {@const y =
                plot.scales.y.fn(tick) +
                (plot.scales.y.type === 'band' ? plot.scales.y.fn.bandwidth() * 0.5 : 0)}
            {@const  x1_ = resolveChannel('x1', tick, options) as number}
            {@const  x2_ = resolveChannel('x2', tick, options) as number}
            {@const  x1 = options.x1 != null ? plot.scales.x.fn(x1_) as number : 0}
            {@const  x2 = options.x2 != null ? plot.scales.x.fn(x2_) as number : plot.facetWidth}
            <line
                transform="translate({plot.options.marginLeft},{y})"
                style={resolveScaledStyles(tick, options, useScale, plot, 'stroke')}
                {x1}
                {x2}
            />
        {/each}
    </g>
</Mark>

<style>
    line {
        stroke: currentColor;
        stroke-opacity: 0.2;
    }
</style>
