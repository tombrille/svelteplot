<script lang="ts">
    import type { Figure } from '$lib/classes/Figure.svelte';
    import type { BaseMarkProps, GridXMarkProps, GridOptions } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import getBaseStyles from '$lib/helpers/getBaseStyles';

    const BaseMark_GridX = BaseMark<BaseMarkProps & GridXMarkProps>;

    const figure = getContext<Figure>('svelteplot');

    let {
        ticks = [],
        y1 = null,
        y2 = null,
        ...styleProps
    } = $props<GridXMarkProps & GridOptions>();

    let autoTicks = $derived(
        ticks.length
            ? ticks
            : figure.xScale.ticks(
                  Math.ceil(figure.plotWidth / (figure.options.x.tickSpacing || 80))
              )
    );
</script>

<BaseMark_GridX type="grid-x" data={ticks} channels={ticks.length ? ['x'] : []} {y1} {y2}>
    <g class="grid-x">
        {#each autoTicks as tick, t}
            <g class="x-tick" transform="translate({figure.xScale(tick)},{figure.margins.top})">
                <line
                    class="grid"
                    style={getBaseStyles(tick, styleProps)}
                    y1={y1 ? figure.yScale(resolveChannel('y', tick, y1)) : 0}
                    y2={y2
                        ? figure.yScale(resolveChannel('y', tick, y2))
                        : figure.height - figure.margins.top - figure.margins.bottom}
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
