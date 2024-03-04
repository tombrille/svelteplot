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
        FacetContext
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
    import groupBy from 'underscore/modules/groupBy.js';
    import { line, type CurveFactory } from 'd3-shape';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { maybeCurve } from '$lib/helpers/curves.js';

    type LineProps = BaseMarkProps & { x?: ChannelAccessor; y?: ChannelAccessor } & LineMarkProps;

    import type { RawValue } from '$lib/types.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import { isValid } from '$lib/helpers/index.js';

    let { data, curve = 'linear', tension = 0, ...options } = $props<LineProps>();

    let groupByKey = $derived(options.z || options.stroke);

    let groups = $derived(
        groupByKey && data.length > 0
            ? Object.values(groupBy(data, (d) => resolveProp(groupByKey, d)))
            : [data]
    );

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

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
            x: (d) => projectX('x', plot.scales, resolveChannel('x', d, options)),
            y: (d) => projectY('y', plot.scales, resolveChannel('y', d, options)),
            defined: (d) =>
                isValid(resolveChannel('x', d, options)) && isValid(resolveChannel('y', d, options))
        })
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
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
                    {@const dx_ = resolveProp(options.dx, lineData[0], 0)}
                    {@const dy_ = resolveProp(options.dy, lineData[0], 0)}
                    {@const markerColor_ =
                        resolveChannel('stroke', lineData[0], options) || 'currentColor'}
                    {@const markerColor = useScale.stroke
                        ? plot.scales.color.fn(markerColor_)
                        : markerColor_}
                    <MarkerPath
                        markerStart={options.markerStart}
                        markerMid={options.markerMid}
                        markerEnd={options.markerEnd}
                        marker={options.marker}
                        strokeWidth={options.strokeWidth}
                        datum={lineData[0]}
                        color={markerColor}
                        d={linePath(
                            options.filter == null
                                ? lineData
                                : lineData.filter((d) => resolveProp(options.filter, d))
                        )}
                        style={resolveScaledStyles(lineData[0], options, useScale, plot, 'stroke')}
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
