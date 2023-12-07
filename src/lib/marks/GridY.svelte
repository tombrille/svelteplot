<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import type { GridYMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { get } from 'underscore';

    const plot = getContext<Plot>('svelteplot');

    let { ticks = [], automatic = false, ...styleProps } = $props<GridYMarkProps>();

    let autoTickCount = $derived(plot.plotHeight / get(plot, 'options.y.tickSpacing', 80));

    let autoTicks = $derived(
        ticks.length > 0 ? ticks : get(plot, 'options.y.ticks', plot.yScale.ticks(autoTickCount))
    );
</script>

<BaseMark type="grid-y" data={ticks} channels={['y']} {automatic}>
    <g class="grid-y">
        {#each autoTicks as tick}
            <g class="y-tick" transform="translate({plot.margins.left},{plot.yScale(tick)})">
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
        stroke: #d9d9d9;
    }
</style>
