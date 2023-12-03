<script lang="ts">
    import type { Figure } from '$lib/classes/Figure.svelte';
    import type { BaseMarkProps, GridXMarkProps, GridOptions, RawValue } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import getBaseStyles from '$lib/helpers/getBaseStyles';
    import removeIdenticalLines from '$lib/helpers/removeIdenticalLines';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat';
    import dayjs from 'dayjs';

    const BaseMark_GridX = BaseMark<BaseMarkProps & GridXMarkProps>;

    const figure = getContext<Figure>('svelteplot');

    let { data = [], y1 = null, y2 = null, ...styleProps } = $props<GridXMarkProps & GridOptions>();

    let ticks = $derived(
        data.length
            ? data
            : figure.xScale.ticks(
                  Math.ceil(figure.plotWidth / (figure.options.x.autoTickDist || 80))
              )
    );
</script>

<BaseMark_GridX type="grid-x" {data} channels={data.length ? ['x'] : []} {y1} {y2}>
    <g class="grid-x">
        {#each ticks as tick, t}
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
