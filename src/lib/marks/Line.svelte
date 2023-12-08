<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import type { BaseMarkProps, LineMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { line } from 'd3-shape';
    import { groupBy } from 'underscore';
    import isDataRecord from '$lib/helpers/isDataRecord.js';

    const BaseMark_Line = BaseMark<BaseMarkProps & LineMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        data,
        x = null,
        y = null,
        z = null,
        fill,
        stroke,
        sort,
        ...styleProps
    } = $props<LineMarkProps>();

    let groups = $derived(
        z || fill || stroke
            ? Object.values(groupBy(data, (d) => resolveChannel('z', d, z || fill || stroke)))
            : [data]
    );

    // let sortBy = $derived(sort && isDataRecord(sort) ? sort.channel === 'stroke' ? stroke : fill : sort);
    let sortedGroups = $derived(
        sort
            ? groups.sort((a, b) =>
                  resolveChannel('sort', a[0], sort) > resolveChannel('sort', b[0], sort) ? 1 : -1
              )
            : groups
    );

    let linePath = line()
        .x((d) => plot.xScale(resolveChannel('x', d, x)))
        .y((d) => plot.yScale(resolveChannel('y', d, y)));
</script>

<BaseMark_Line
    type="line"
    {data}
    channels={['x', 'y', 'color']}
    {x}
    {y}
    {fill}
    {stroke}
    {...styleProps}
>
    <g class="lines">
        {#each sortedGroups as lineData}
            <path
                d={linePath(lineData)}
                stroke={stroke
                    ? plot.colorScale(resolveChannel('color', lineData[0], stroke))
                    : 'currentColor'}
                fill={fill ? plot.colorScale(resolveChannel('color', lineData[0], fill)) : 'none'}
                style={getBaseStyles(lineData[0], styleProps)}
            />
        {/each}
    </g>
</BaseMark_Line>

<style>
    .lines path {
        stroke-width: 1.4px;
    }
</style>
