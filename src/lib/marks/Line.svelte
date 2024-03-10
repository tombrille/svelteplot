<!--
    @component
    Line mark, useful for line charts
-->
<script context="module" lang="ts">
    import type {
        CurveName,
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        MarkerOptions,
        FacetContext,
        PlotState
    } from '../types.js';
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
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
    } & MarkerOptions;
</script>

<script lang="ts">
    import Mark from '../Mark.svelte';
    import MarkerPath from './helpers/MarkerPath.svelte';
    import { getContext } from 'svelte';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { line, type CurveFactory } from 'd3-shape';
    import { geoPath } from 'd3-geo';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { maybeCurve } from '$lib/helpers/curves.js';

    type LineProps = BaseMarkProps & { x?: ChannelAccessor; y?: ChannelAccessor } & LineMarkProps;

    import type { RawValue } from '$lib/types.js';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import { isValid } from '$lib/helpers/index.js';
    import { recordizeXY } from '$lib/transforms/recordize.js';

    let { data, curve = 'auto', tension = 0, ...options } = $props<LineProps>();

    let args = $derived(recordizeXY({ data, ...options }));

    function groupIndex(data, groupByKey) {
        let group = [];
        const groups = [group];
        let lastGroupValue;
        for (const d of data) {
            
            const groupValue = resolveProp(groupByKey, d);
            // console.log({d, groupValue})
            if (!group.length || groupValue === lastGroupValue) {
                group.push(d);
            } else {
                if (group.length === 1) {
                    // jsut one point makes a bad line, add this one, too
                    group.push(d);
                }
                // new group
                group = [d];
                groups.push(group);
                lastGroupValue = groupValue;
            }
        }
        return groups;
        // return Object.values(groupBy(args.data, (d) => ))
    }

    let groups = $derived(
        groupByKey && args.data.length > 0
            ? groupIndex(args.data, groupByKey)
            : [args.data]
    );

    let groupByKey = $derived(args.z || args.stroke);

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    // let sortBy = $derived(sort && isDataRecord(sort) ? sort.channel === 'stroke' ? stroke : fill : sort);
    let sortedGroups = $derived(
        args.sort
            ? groups.sort((a, b) =>
                  resolveChannel('sort', a[0], args) > resolveChannel('sort', b[0], args) ? 1 : -1
              )
            : groups
    );

    let linePath: (d: DataRecord[]) => string = $derived(
        plot.scales.projection && curve === 'auto'
            ? sphereLine(plot.scales.projection)
            : callWithProps(line, [], {
                  curve: maybeCurve(curve === 'auto' ? 'linear' : curve, tension),
                  x: (d) => d.__px,
                  y: (d) => d.__py,
                  defined: (d) => isValid(d.__px) && isValid(d.__py)
              })
    );

    function sphereLine(projection) {
        const path = geoPath(projection);
        return (lineData: DataRecord[]) => {
            let line = [];
            const lines = [line];
            for (const datum of lineData) {
                // if x or y is undefined, start a new line segment
                const x = resolveChannel('x', datum, args);
                const y = resolveChannel('y', datum, args);
                if (!isValid(x) || !isValid(y)) {
                    line = [];
                    lines.push(line);
                } else {
                    line.push([x, y]);
                }
            }
            return path({ type: 'MultiLineString', coordinates: lines });
        };
    }

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());

    function projectLineData(lineData: DataRecord[], plot: PlotState) {
        return lineData.map((d) => {
            [d.__px, d.__py] = projectXY(
                plot.scales,
                resolveChannel('x', d, args),
                resolveChannel('y', d, args),
                true,
                true
            );
            return d;
        });
    }
</script>

<Mark
    type="line"
    channels={['x', 'y', 'opacity', 'stroke', 'strokeOpacity', 'fx', 'fy']}
    required={['x', 'y']}
    {...args}
    let:mark
>
    {#if data.length > 0}
        {@const useScale = getUsedScales(plot, args, mark)}
        <g class="lines">
            {#each sortedGroups as lineData, i}
                {#if testFacet(lineData[0], mark.options)}
                    {@const dx_ = resolveProp(args.dx, lineData[0], 0)}
                    {@const dy_ = resolveProp(args.dy, lineData[0], 0)}
                    {@const markerColor_ =
                        resolveChannel('stroke', lineData[0], args) || 'currentColor'}
                    {@const markerColor = useScale.stroke
                        ? plot.scales.color.fn(markerColor_)
                        : markerColor_}
                    <MarkerPath
                        {mark}
                        markerStart={args.markerStart}
                        markerMid={args.markerMid}
                        markerEnd={args.markerEnd}
                        marker={args.marker}
                        strokeWidth={args.strokeWidth}
                        datum={lineData[0]}
                        color={markerColor}
                        d={linePath(
                            projectLineData(
                                args.filter == null
                                    ? lineData
                                    : lineData.filter((d) => resolveProp(args.filter, d)),
                                plot
                            )
                        )}
                        style={resolveScaledStyles(lineData[0], args, useScale, plot, 'stroke')}
                        transform={dx_ || dy_ ? `translate(${dx_},${dy_})` : null}
                    />
                {/if}
            {/each}
        </g>
    {/if}
</Mark>

<style>
    /* todo: remove :global */
    .lines :global(path) {
        stroke-width: 1.4px;
        stroke-linejoin: round;
    }
</style>
