<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, GridXMarkProps, GridOptions } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import getBaseStyles from '$lib/helpers/getBaseStyles';

    const BaseMark_GridX = BaseMark<BaseMarkProps & GridXMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        ticks = [],
        y1 = null,
        y2 = null,
        ...styleProps
    } = $props<GridXMarkProps & GridOptions>();

    let autoTicks = $derived(
        ticks.length
            ? ticks
            : plot.options.x.ticks
              ? plot.options.x.ticks
              : plot.xScale.ticks(Math.ceil(plot.plotWidth / (plot.options.x.tickSpacing || 80)))
    );
</script>

<BaseMark_GridX type="grid-x" data={ticks} channels={['x']} {y1} {y2}>
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
