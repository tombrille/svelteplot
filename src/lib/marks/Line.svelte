<!--
    @component
    Line mark, useful for line charts
-->
<script context="module" lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    export type LineMarkProps = {
        data: DataRecord[];
        z?: ChannelAccessor;
        stroke?: ChannelAccessor;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
        curve?: CurveName | CurveFactory;
        tension?: number;
        /**
         * the marker for the starting point of a line segment
         */
        markerStart?: boolean | MarkerShape;
        /**
         * the marker for any intermediate point of a line segment
         */
        markerMid?: boolean | MarkerShape;
        /**
         * the marker for the end point of a line segment
         */
        markerEnd?: boolean | MarkerShape;
        /**
         * shorthand for setting the marker on all points
         */
        marker?: boolean | MarkerShape;
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
    };
</script>

<script lang="ts">
    import Mark from '../Mark.svelte';
    import Marker, { type MarkerShape } from './helpers/Marker.svelte';
    import { getContext, type Snippet } from 'svelte';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { groupBy } from 'underscore';
    import { line, type CurveFactory } from 'd3-shape';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { maybeCurve } from '$lib/helpers/curves.js';
    import { maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';

    const id = randomId();

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
    import { randomId } from '$lib/helpers/index.js';

    type LineProps = BaseMarkProps & {
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    } & LineMarkProps;

    let { data, curve = 'linear', tension = 0, ...options } = $props<LineProps>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let groupByKey = $derived(options.z || options.stroke);

    let groups = $derived(
        groupByKey && data.length > 0
            ? Object.values(groupBy(data, (d) => resolveProp(groupByKey, d)))
            : [data]
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
            defined: (d) => !isNaN(resolveChannel('y', d, options) as number)
        })
    );

    const { getTestFacet } = getContext('facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="line"
    {data}
    channels={['x', 'y', 'opacity', 'stroke', 'strokeOpacity', 'fx', 'fy']}
    required={['x', 'y']}
    {...options}
    let:mark
>
    {#if data.length > 0}
        {@const useScale = getUsedScales(plot, options, mark)}
        <g class="lines">
            {#each sortedGroups as lineData, i}
                {#if testFacet(lineData[0], mark.options)}
                    {@const  dx_ = resolveProp(options.dx, lineData[0] as DataRecord, 0) as number}
                    {@const  dy_ = resolveProp(options.dy, lineData[0] as DataRecord, 0) as number}
                    {@const  marker = resolveProp(options.marker, lineData[0] as DataRecord) as string}
                    {@const  markerStart = resolveProp(options.markerStart, lineData[0] as DataRecord) as string}
                    {@const  markerMid = resolveProp(options.markerMid, lineData[0] as DataRecord) as string}
                    {@const  markerEnd = resolveProp(options.markerEnd, lineData[0] as DataRecord) as string}
                    {@const markerColor_ =
                        resolveChannel('stroke', lineData[0], options) || 'currentColor'}
                    {@const markerColor = useScale.stroke
                        ? plot.scales.color.fn(markerColor_)
                        : markerColor_}
                    {@const  strokeWidth = resolveProp(options.strokeWidth, lineData[0], 1.4) as number}
                    <g stroke-width={strokeWidth}>
                        {#if markerStart}
                            <Marker
                                id={`marker-start-${id}-${i}`}
                                shape={marker === true ? 'dot' : marker}
                                color={markerColor}
                            />
                        {/if}
                        {#if markerMid}
                            <Marker
                                id={`marker-mid-${id}-${i}`}
                                shape={marker === true ? 'circle' : marker}
                                color={markerColor}
                            />
                        {/if}
                        {#if markerEnd}
                            <Marker
                                id={`marker-end-${id}-${i}`}
                                shape={marker === true ? 'circle' : marker}
                                color={markerColor}
                            />
                        {/if}
                        {#if marker}
                            <Marker
                                id={`marker-${id}-${i}`}
                                shape={marker === true ? 'circle' : marker}
                                color={markerColor}
                            />
                        {/if}
                        <path
                            marker-start={markerStart || marker
                                ? `url(#marker-${markerStart ? 'start-' : ''}${id}-${i})`
                                : null}
                            marker-mid={markerMid || marker
                                ? `url(#marker-${markerMid ? 'mid-' : ''}${id}-${i})`
                                : null}
                            marker-end={markerEnd || marker
                                ? `url(#marker-${markerEnd ? 'end-' : ''}${id}-${i})`
                                : null}
                            d={linePath(
                                options.filter == null
                                    ? lineData
                                    : lineData.filter((d) => resolveProp(options.filter, d))
                            )}
                            style={resolveScaledStyles(
                                lineData[0],
                                options,
                                useScale,
                                plot,
                                'stroke'
                            )}
                            transform={dx_ || dy_ ? `translate(${dx_},${dy_})` : null}
                        />
                    </g>
                {/if}
            {/each}
        </g>
    {/if}
</Mark>

<style>
    /* todo: remove :global */
    .lines :global(path) {
        stroke-width: 1.4px;
        fill: none;
        stroke-linejoin: round;
    }
</style>
