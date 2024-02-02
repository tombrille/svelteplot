<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext } from 'svelte';
    import Mark from '../Mark.svelte';
    import type { PlotContext, BaseMarkStyleProps, RawValue, DataRecord } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveChannel } from '../helpers/resolve.js';
    import { fade } from 'svelte/transition';

    let {
        data = [],
        automatic,
        ...options
    } = $props<{ data?: RawValue[]; automatic?: boolean } & BaseMarkStyleProps>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let autoTickCount = $derived(
        Math.max(2, Math.round(plot.plotHeight / plot.options.y.tickSpacing))
    );

    let ticks: RawValue[] = $derived(
        data.length > 0
            ? // use custom tick values if user passed any as prop
              data
            : // use custom scale tick values if user passed any as plot scale option
              plot.options.y.ticks ||
                  // fall back to auto-generated ticks
                  plot.scales.y.fn.ticks(autoTickCount)
    );
</script>

<Mark
    type="gridY"
    data={data.length ? data.map((tick) => ({ __y: tick })) as DataRecord[] : []}
    channels={['x1', 'x2', 'y', 'stroke']}
    {...{ ...options, y: '__y' }}
    {automatic}
    let:mark
>
    <g class="grid-x">
        {#each ticks as tick}
            {@const y =
                plot.scales.y.fn(tick) +
                (plot.scales.y.type === 'band' ? plot.scales.y.fn.bandwidth() * 0.5 : 0)}
            {@const x1_ = resolveChannel('x1', tick, options) as number}
            {@const x2_ = resolveChannel('x2', tick, options) as number}
            {@const x1 = options.x1 != null ? plot.scales.x.fn(x1_) as number : 0}
            {@const x2 = options.x2 != null ? plot.scales.x.fn(x2_) as number : plot.width - plot.options.marginLeft - plot.options.marginRight}
            <line
                in:fade
                transform="translate({plot.options.marginLeft},{y})"
                style={getBaseStyles(tick, options)}
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
