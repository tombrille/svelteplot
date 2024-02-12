<script context="module" lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    export type AreaMarkProps = {
        z?: ChannelAccessor;
        fill?: ChannelAccessor;
        stroke?: ChannelAccessor;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
        curve?: CurveName | CurveFactory;
        tension?: number;
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
        stack?: Partial<StackOptions>;
    };
</script>

<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import { groupBy } from 'underscore';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { area, type CurveFactory } from 'd3-shape';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { maybeCurve } from '$lib/helpers/curves.js';

    import type {
        CurveName,
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor
    } from '../types.js';
    import type { RawValue } from '$lib/types.js';
    import { getUsedScales } from '../helpers/scales.js';
    import type { StackOptions } from '$lib/transforms/stack.js';

    type AreaProps = BaseMarkProps & {
        data: DataRecord[];
        /**
         * Lorem ipsum
         */
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
    } & AreaMarkProps;

    let {
        data,
        /** the curve */
        curve = 'linear',
        tension = 0,
        ...options
    } = $props<AreaProps>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let groupByKey = $derived(options.z || options.fill || options.stroke);

    let groups = $derived(
        groupByKey ? Object.values(groupBy(data, (d) => resolveProp(groupByKey, d))) : [data]
    );

    // let sortBy = $derived(sort && isDataRecord(sort) ? sort.channel === 'stroke' ? stroke : fill : sort);
    let sortedGroups = $derived(
        options.sort
            ? groups.sort((a, b) =>
                  resolveChannel('sort', a[0], channels) > resolveChannel('sort', b[0], channels)
                      ? 1
                      : -1
              )
            : groups
    );

    let areaPath: (d: DataRecord[]) => string = $derived(
        callWithProps(area, [], {
            curve: maybeCurve(curve, tension),
            ...(options.x1 != null && options.x2 != null
                ? {
                      // "vertical" area
                      x0: (d) => plot.scales.x.fn(resolveChannel('x1', d, options)),
                      x1: (d) => plot.scales.x.fn(resolveChannel('x2', d, options)),
                      y: (d) => plot.scales.y.fn(resolveChannel('y1', d, options))
                  }
                : {
                      // "horizontal" area
                      x: (d) => plot.scales.x.fn(resolveChannel('x1', d, options)),
                      y0: (d) => plot.scales.y.fn(resolveChannel('y1', d, options)),
                      y1: (d) => plot.scales.y.fn(resolveChannel('y2', d, options))
                  })
        })
    );
</script>

<Mark
    type="area"
    {data}
    channels={['x1', 'x2', 'y1', 'y2', 'fill', 'stroke']}
    required={['x1', 'y1']}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="areas">
        {#each sortedGroups as areaData}
            {@const fill_ = resolveChannel('fill', areaData[0], options)}
            {@const stroke_ = resolveChannel('stroke', areaData[0], options)}
            {@const       fill = (useScale.fill ? plot.scales.color.fn(fill_) : fill_) as string}
            {@const       stroke = (useScale.stroke ? plot.scales.color.fn(stroke_) : stroke_) as string}
            {@const       dx_ = resolveProp(options.dx, areaData[0] as DataRecord, 0) as number}
            {@const       dy_ = resolveProp(options.dy, areaData[0] as DataRecord, 0) as number}
            <path
                d={areaPath(
                    options.filter == null
                        ? areaData
                        : areaData.filter((d) => resolveProp(options.filter, d))
                )}
                style={getBaseStyles(areaData[0], options)}
                fill={fill_ ? fill : stroke_ ? null : 'currentColor'}
                stroke={stroke_ ? stroke : null}
                transform={dx_ || dy_ ? `translate(${dx_},${dy_})` : null}
            />
        {/each}
    </g>
</Mark>

<style>
    .lines path {
        stroke-width: 1.4px;
    }
</style>
