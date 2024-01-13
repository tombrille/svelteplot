<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { GridYMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { get } from 'underscore';

    const plot = getContext<Plot>('svelteplot');

    let { ticks = [], automatic = false, ...styleProps } = $props<GridYMarkProps>();

    let autoTickCount = $derived(plot.plotHeight / (plot.options.y?.tickSpacing || 80));

    let autoTicks = $derived(
        ticks.length > 0 ? ticks : plot.options.y?.ticks || plot.yScale.ticks(autoTickCount)
    );
</script>

<BaseMark
    type="grid-y"
    data={ticks.length ? ticks.map((tick) => ({ __y: tick })) : undefined}
    channels={['y']}
    y="__y"
    {automatic}
>
    <g class="grid-y">
        {#each autoTicks as tick}
            <g
                class="y-tick"
                transform="translate({plot.margins.left},{plot.yScale(tick) +
                    (plot.yScale.bandwidth ? plot.yScale.bandwidth() * 0.5 : 0)})"
            >
                <line
                    style={getBaseStyles(tick, styleProps)}
                    class="grid"
                    x2={plot.width - plot.margins.right - plot.margins.left}
                />
            </g>
        {/each}
    </g>
</BaseMark>

<style>
    .y-tick line.grid {
        stroke: currentColor;
        stroke-opacity: 0.2;
    }
</style>
