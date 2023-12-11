<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        ChannelName
    } from '$lib/types.js';
    export type AreaMarkProps = MarkProps &
        BaseMarkStyleProps & {
            x1?: ChannelAccessor;
            x2?: ChannelAccessor;
            y1?: ChannelAccessor;
            y2?: ChannelAccessor;
            z?: ChannelAccessor;
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import type { BaseMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { area } from 'd3-shape';
    import { groupBy } from 'underscore';
    import callWithProps from '$lib/helpers/callWithProps.js';

    const BaseMark_Area = BaseMark<BaseMarkProps & AreaMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        data,
        x1 = null,
        x2 = null,
        y1 = null,
        y2 = null,
        z = null,
        fill = null,
        stroke = null,
        sort = null,
        ...styleProps
    } = $props<AreaMarkProps>();

    let channels = $derived<Record<ChannelName, ChannelAccessor>>({
        x1,
        x2,
        y1,
        y2,
        fill,
        stroke,
        z,
        sort
    });

    let groups = $derived(
        z || fill || stroke
            ? Object.values(groupBy(data, (d) => resolveChannel('z', d, channels)))
            : [data]
    );

    // let sortBy = $derived(sort && isDataRecord(sort) ? sort.channel === 'stroke' ? stroke : fill : sort);
    let sortedGroups = $derived(
        sort
            ? groups.sort((a, b) =>
                  resolveChannel('sort', a[0], channels) > resolveChannel('sort', b[0], channels)
                      ? 1
                      : -1
              )
            : groups
    );

    let areaPath = $derived(
        callWithProps(
            area,
            [],
            x1 != null && x2 != null
                ? {
                      // vertical area
                      x0: (d) => plot.xScale(resolveChannel('x1', d, channels)),
                      x1: (d) => plot.xScale(resolveChannel('x2', d, channels)),
                      y: (d) => plot.yScale(resolveChannel('y1', d, channels))
                  }
                : {
                      // horizontal area
                      x: (d) => plot.xScale(resolveChannel('x1', d, channels)),
                      y0: (d) => plot.yScale(resolveChannel('y1', d, channels)),
                      y1: (d) => plot.yScale(resolveChannel('y2', d, channels))
                  }
        )
    );

    // $inspect(plot.x.activeMarks[0]?.dataValues)
</script>

<BaseMark_Area
    type="area"
    {data}
    channels={['x1', 'x2', 'y1', 'y2', 'fill', 'stroke']}
    {x1}
    {x2}
    {y1}
    {y2}
    {fill}
    {stroke}
    {...styleProps}
>
    <g class="areas">
        {#each sortedGroups as areaData}
            <path
                d={areaPath(areaData)}
                style:stroke={stroke
                    ? plot.colorScale(resolveChannel('color', areaData[0], stroke))
                    : 'none'}
                style:fill={fill
                    ? plot.colorScale(resolveChannel('color', areaData[0], fill))
                    : 'currentColor'}
                style={getBaseStyles(areaData[0], styleProps)}
            />
        {/each}
    </g>
</BaseMark_Area>

<style>
    .lines path {
        stroke-width: 1.4px;
    }
</style>
