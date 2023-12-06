<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import type { BaseMarkProps, LineMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';
    import { line } from 'd3-shape';
    import { groupBy } from 'underscore';

    const BaseMark_Line = BaseMark<BaseMarkProps & LineMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        data,
        x = null,
        y = null,
        z = null,
        fill,
        stroke,
        r = 5,
        ...styleProps
    } = $props<LineMarkProps>();

    let groups = $derived(
        z ? Object.values(groupBy(data, (d) => resolveChannel('z', d, z))) : [data]
    ); // todo: split by z
    let linePath = line()
        .x((d) => plot.xScale(resolveChannel('x', d, x)))
        .y((d) => plot.yScale(resolveChannel('y', d, y)));
</script>

<BaseMark_Line
    type="dot"
    {data}
    channels={['x', 'y', 'radius', 'color']}
    {x}
    {y}
    {r}
    {fill}
    {stroke}
    {...styleProps}
>
    <g class="lines">
        {#each groups as lineData}
            <path d={linePath(lineData)} style={getBaseStyles(lineData[0], styleProps)} />
        {/each}
    </g>
</BaseMark_Line>

<style>
    .lines path {
        stroke: currentColor;
        fill: none;
        stroke-width: 1.4px;
    }
</style>
