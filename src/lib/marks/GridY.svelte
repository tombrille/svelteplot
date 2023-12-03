<script lang="ts">
    import type { Figure } from '$lib/classes/Figure.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import type { GridYMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';

    const figure = getContext<Figure>('svelteplot');

    let { ticks = [], ...styleProps } = $props<GridYMarkProps>();

    let autoTicks = $derived(
        ticks.length > 0
            ? ticks
            : figure.yScale.ticks(
                  Math.ceil(figure.plotHeight / (figure.options.y.tickSpacing || 80))
              )
    );
</script>

<BaseMark type="grid-y" data={ticks} channels={ticks.length ? ['y'] : []}>
    <g class="grid-y">
        {#each autoTicks as tick}
            <g class="y-tick" transform="translate({figure.margins.left},{figure.yScale(tick)})">
                <line
                    style={getBaseStyles(tick, styleProps)}
                    class="grid"
                    x2={figure.width - figure.margins.right - figure.margins.left}
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
