<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     *
     */
    import { getContext, type Snippet } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        CurveName,
        MarkerOptions,
        RawValue,
        FacetContext
    } from '../types.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { maybeData, testFilter } from '../helpers/index.js';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';
    import MarkerPath from './helpers/MarkerPath.svelte';
    import { replaceChannels } from '$lib/transforms/rename.js';
    import { line, type CurveFactory } from 'd3-shape';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { maybeCurve } from '$lib/helpers/curves.js';

    let {
        data,
        curve,
        tension = 0,
        onmouseenter,
        onmouseleave,
        onclick,
        ...options
    } = $props<
        BaseMarkProps & {
            data: DataRecord[];
            sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
            x1: ChannelAccessor;
            y1: ChannelAccessor;
            x2: ChannelAccessor;
            y2: ChannelAccessor;
            stroke?: ChannelAccessor;
            curve?: CurveName | CurveFactory;
            tension?: number;
            children?: Snippet;
        } & MarkerOptions
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && (typeof value === 'string' || !Number.isNaN(value));
    }

    let sorted = $derived(
        options.sort
            ? maybeData(data).toSorted((a, b) =>
                  resolveChannel('sort', a, options) > resolveChannel('sort', b, options) ? 1 : -1
              )
            : maybeData(data)
    );

    let args = $derived(
        replaceChannels({ data: sorted, ...options }, { y: ['y1', 'y2'], x: ['x1', 'x2'] })
    );

    let linePath: (d: DataRecord[]) => string = $derived(
        callWithProps(line, [], {
            curve: maybeCurve(curve, tension),
            x: (d) => d[0],
            y: (d) => d[1]
        })
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="arrow"
    required={['x1', 'x2', 'y1', 'y2']}
    channels={['x1', 'y1', 'x2', 'y2', 'fx', 'fy', 'opacity', 'stroke', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g class="arrow" data-use-x={useScale.x ? 1 : 0}>
        {#each args.data as datum}
            {#if testFilter(datum, args) && testFacet(datum, mark.options)}
                {@const _x1 = resolveChannel('x1', datum, args)}
                {@const _x2 = resolveChannel('x2', datum, args)}
                {@const _y1 = resolveChannel('y1', datum, args)}
                {@const _y2 = resolveChannel('y2', datum, args)}
                {@const color = resolveChannel('stroke', datum, args)}
                {#if isValid(_x1) && isValid(_x2) && isValid(_y1) && isValid(_y2)}
                    {@const [x1, y1] = projectXY(plot.scales, _x1, _y1, useScale.x1, useScale.y1)}
                    {@const [x2, y2] = projectXY(plot.scales, _x2, _y2, useScale.x2, useScale.y2)}
                    {@const dx = resolveProp(args.dx, datum, 0)}
                    {@const dy = resolveProp(args.dx, datum, 0)}
                    <MarkerPath
                        markerStart={args.markerStart}
                        markerMid={args.markerMid}
                        markerEnd={args.markerEnd}
                        marker={args.marker}
                        strokeWidth={args.strokeWidth}
                        {datum}
                        color={useScale.stroke ? plot.scales.color.fn(color) : color}
                        d={linePath([
                            [x1, y1],
                            [x2, y2]
                        ])}
                        style={resolveScaledStyles(datum, args, useScale, plot, 'stroke')}
                        transform={dx || dy ? `translate(${dx}, ${dy})` : null}
                        {onclick}
                        {onmouseenter}
                        {onmouseleave}
                    />
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    path {
        stroke-width: 1.6px;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
</style>
