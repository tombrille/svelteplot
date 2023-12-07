<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, GridXMarkProps, GridOptions } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { get } from 'underscore';

    const BaseMark_GridX = BaseMark<BaseMarkProps & GridXMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        ticks = [],
        y1 = null,
        y2 = null,
        automatic = false,
        ...styleProps
    } = $props<GridXMarkProps & GridOptions>();

    let autoTickCount = $derived(plot.plotWidth / get(plot, 'options.x.tickSpacing', 80));

    let autoTicks = $derived(
        ticks.length > 0 ? ticks : get(plot, 'options.x.ticks', plot.xScale.ticks(autoTickCount))
    );
</script>

<BaseMark_GridX type="grid-x" data={ticks} channels={['x']} {y1} {y2} {automatic}>
    <g class="grid-x">
        {#each autoTicks as tick, t}
            <g class="x-tick" transform="translate({plot.xScale(tick)},{plot.margins.top})">
                <line
                    class="grid"
                    style={getBaseStyles(tick, styleProps)}
                    y1={y1 ? plot.yScale(resolveChannel('y', tick, y1)) : 0}
                    y2={y2
                        ? plot.yScale(resolveChannel('y', tick, y2))
                        : plot.height - plot.margins.top - plot.margins.bottom}
                />
            </g>
        {/each}
    </g>
</BaseMark_GridX>

<style>
    .x-tick line.grid {
        stroke: #d9d9d9;
    }
</style>
