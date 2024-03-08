<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext } from 'svelte';
    import Mark from '../Mark.svelte';
    import type { PlotContext, BaseMarkProps, RawValue } from '../types.js';
    import { resolveChannel, resolveScaledStyles } from '../helpers/resolve.js';
    import { autoTicks } from '$lib/helpers/autoTicks.js';
    import { getUsedScales } from '$lib/helpers/scales.js';
    import { testFilter } from '$lib/helpers/index.js';

    let {
        data = [],
        automatic = false,
        ...options
    } = $props<{ data?: RawValue[]; automatic?: boolean } & BaseMarkProps>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let autoTickCount = $derived(
        Math.max(3, Math.round(plot.facetWidth / plot.options.x.tickSpacing))
    );

    let ticks: RawValue[] = $derived(
        data.length > 0
            ? // use custom tick values if user passed any as prop
              data
            : // use custom scale tick values if user passed any as plot scale option
              autoTicks(
                  plot.scales.x.type,
                  plot.options.x.ticks,
                  plot.options.x.interval,
                  plot.scales.x.domain,
                  plot.scales.x.fn,
                  autoTickCount
              )
    );
</script>

<Mark
    type="gridX"
    data={data.length ? data.map((tick) => ({ __x: tick })) : []}
    channels={['y1', 'y2', 'x', 'stroke', 'strokeOpacity']}
    {...{ ...options, x: '__x' }}
    {automatic}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="grid-x">
        {#each ticks as tick}
            {#if testFilter(tick, options)}
                {@const x =
                    plot.scales.x.fn(tick) +
                    (plot.scales.x.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)}
                {@const y1_ = resolveChannel('y1', tick, options)}
                {@const y2_ = resolveChannel('y2', tick, options)}
                {@const y1 = options.y1 != null ? plot.scales.y.fn(y1_) : 0}
                {@const y2 = options.y2 != null ? plot.scales.y.fn(y2_) : plot.facetHeight}
                <line
                    transform="translate({x},{plot.options.marginTop})"
                    style={resolveScaledStyles(tick, options, useScale, plot, 'stroke')}
                    {y1}
                    {y2}
                />
            {/if}
        {/each}
    </g>
</Mark>

<style>
    line {
        stroke: currentColor;
        stroke-opacity: 0.2;
    }
</style>
