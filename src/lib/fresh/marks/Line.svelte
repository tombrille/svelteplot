<script context="module" lang="ts">
    export type LineMarkProps = {
        z?: ChannelAccessor;
        stroke?: ChannelAccessor;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
        curve?: CurveName | CurveFactory;
        tension?: number;
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
    };
</script>

<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import { groupBy } from 'underscore';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { line, type CurveFactory } from 'd3-shape';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { maybeCurve } from '$lib/helpers/curves.js';

    import type {
        CurveName,
        PlotContext,
        DataRecord,
        BaseMarkStyleProps,
        ConstantAccessor,
        ChannelAccessor
    } from '../types.js';
    import type { RawValue } from '$lib/types.js';
    import { getUsedScales } from '../helpers/scales.js';

    type LineProps = BaseMarkStyleProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    } & LineMarkProps;

    let { data, curve = 'linear', tension = 0, ...options } = $props<LineProps>();

    const { state } = getContext<PlotContext>('svelteplot');
    let plot = $derived(state());

    let groupByKey = $derived(options.z || options.stroke);

    let groups = $derived(
        groupByKey ? Object.values(groupBy(data, (d) => resolveProp(groupByKey, d))) : [data]
    );

    // let sortBy = $derived(sort && isDataRecord(sort) ? sort.channel === 'stroke' ? stroke : fill : sort);
    let sortedGroups = $derived(
        options.sort
            ? groups.sort((a, b) =>
                  resolveChannel('sort', a[0], options) > resolveChannel('sort', b[0], options)
                      ? 1
                      : -1
              )
            : groups
    );

    let linePath: (d: DataRecord[]) => string = $derived(
        callWithProps(line, [], {
            curve: maybeCurve(curve, tension),
            x: (d) => plot.scales.x.fn(resolveChannel('x', d, options)),
            y: (d) => plot.scales.y.fn(resolveChannel('y', d, options)),
        })
    );
</script>

<Mark
    type="line"
    {data}
    channels={['x', 'y', 'stroke']}
    required={['x', 'y']}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="lines">
        {#each sortedGroups as lineData}
            {@const stroke_ = resolveChannel('stroke', lineData[0], options)}
            {@const stroke = (useScale.stroke ? plot.scales.color.fn(stroke_) : stroke_) as string}
            {@const dx_ = resolveProp(options.dx, lineData[0] as DataRecord, 0) as number}
            {@const dy_ = resolveProp(options.dy, lineData[0] as DataRecord, 0) as number}
            <path
                d={linePath(lineData)}
                style={getBaseStyles(lineData[0], options)}
                style:stroke={stroke_ ? stroke : 'currentColor'}
                transform={dx_ || dy_ ? `translate(${dx_},${dy_})` : null}
            />
        {/each}
    </g>
</Mark>

<style>
    .lines path {
        stroke-width: 1.4px;
        fill: none;
    }
</style>
