<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        ScaledChannelName,
        Curve,
        DataRow
    } from '$lib/types.js';
    export type LineMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            z?: ChannelAccessor;
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
            // static
            curve: Curve | CurveFactory;
            tension: number;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { resolveProp, resolveChannel } from '$lib/helpers/resolve.js';
    import type { BaseMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { line, type CurveFactory } from 'd3-shape';
    import { groupBy } from 'underscore';
    import { maybeCurve } from '$lib/helpers/curves.js';

    const BaseMark_Line = BaseMark<BaseMarkProps & LineMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, curve, tension, ...channels } = $props<LineMarkProps>();

    let { sort, z, fill, stroke } = $derived(channels);

    let groups = $derived(
        z || fill || stroke
            ? Object.values(groupBy(data, (d) => resolveChannel('z', d, channels)))
            : [data]
    );

    let sortedGroups = $derived(
        sort
            ? groups.sort((a, b) =>
                  resolveChannel('sort', a[0], channels) > resolveChannel('sort', b[0], channels)
                      ? 1
                      : -1
              )
            : groups
    );

    let linePath = $derived(
        line()
            .curve(maybeCurve(curve, tension))
            .x((d) => plot.xScale(resolveChannel('x', d, channels)))
            .y((d) => plot.yScale(resolveChannel('y', d, channels)))
    );
</script>

<BaseMark_Line type="line" {data} channels={['x', 'y', 'color']} {...channels}>
    <g class="lines">
        {#each sortedGroups as lineData}
            <path
                d={linePath(lineData)}
                stroke={stroke
                    ? plot.colorScale(resolveChannel('stroke', lineData[0], channels))
                    : 'currentColor'}
                fill={fill
                    ? plot.colorScale(resolveChannel('fill', lineData[0], channels))
                    : 'none'}
                style={getBaseStyles(lineData[0], channels)}
            />
        {/each}
    </g>
</BaseMark_Line>

<style>
    .lines path {
        stroke-width: 1.4px;
    }
</style>
