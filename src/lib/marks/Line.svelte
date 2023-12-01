<script lang="ts">
    import type { Figure } from '$lib/classes/Figure.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import type { BaseMarkProps, LineMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';
    import { line } from 'd3-shape';

    const BaseMark_Dot = BaseMark<BaseMarkProps & LineMarkProps>;

    const figure = getContext<Figure>('svelteplot');

    let { data, x = null, y = null, r = 5, ...styleProps } = $props<LineMarkProps>();

    let groups = $derived([data]); // todo: split by z
    let linePath = line()
        .x((d) => figure.xScale(resolveChannel('x', d, x)))
        .y((d) => figure.yScale(resolveChannel('y', d, y)));

    // console.log({r,data}, figure.radius.domain, figure.radiusScale(resolveChannel('radius', data[0], r)))
</script>

<BaseMark_Dot type="dot" {data} channels={['x', 'y', 'radius']} {x} {y} {r} {...styleProps}>
    <g class="lines">
        {#each groups as lineData}
            <path d={linePath(lineData)} style={getBaseStyles(lineData[0], styleProps)} />
        {/each}
    </g>
</BaseMark_Dot>

<style>
    .lines path {
        stroke: currentColor;
        fill: none;
        stroke-width: 1.4px;
    }
</style>
