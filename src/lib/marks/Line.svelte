<!--
    @component
    Line mark, useful for line charts
-->
<script module lang="ts">
    import type {
        CurveName,
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        MarkerOptions,
        FacetContext,
        PlotState,
        ScaledDataRecord
    } from '../types.js';

    export type BaseLineMarkProps = {
        data: DataRecord[];
        z?: ChannelAccessor;
        stroke?: ChannelAccessor;
        outlineStroke?: ConstantAccessor<string>;
        outlineStrokeWidth?: ConstantAccessor<number>;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
        curve?: CurveName | CurveFactory;
        tension?: number;
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
        text?: ConstantAccessor<string>;
        textFill?: ConstantAccessor<string>;
        textStroke?: ConstantAccessor<string>;
        textStartOffset?: ConstantAccessor<string>;
        textStrokeWidth?: ConstantAccessor<number>;
        lineClass?: ConstantAccessor<string>;
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
    import { pick } from 'es-toolkit';

    type LineMarkProps = BaseMarkProps & {
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    } & BaseLineMarkProps;

    import type { RawValue } from '$lib/types.js';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import { isValid } from '$lib/helpers/index.js';
    import { sort } from '$lib/transforms/sort.js';
    import { recordizeXY } from '$lib/transforms/recordize.js';
    import GroupMultiple from './helpers/GroupMultiple.svelte';

    let {
        data = [{}],
        curve = 'auto',
        tension = 0,
        text,
        class: className = null,
        lineClass = null,
        ...options
    }: LineMarkProps = $props();

    let args = $derived(sort(recordizeXY({ data, ...options })));

    function groupIndex(data: ScaledDataRecord[], groupByKey) {
        if (!groupByKey) return [data];
        let group = [];
        const groups = [group];
        let lastGroupValue;
        for (const d of data) {
            const groupValue = resolveProp(groupByKey, d.datum);
            if (groupValue === lastGroupValue) {
                group.push(d);
            } else {
                if (group.length === 1) {
                    // just one point makes a bad line, add this one, too
                    group.push(d);
                }
                // new group
                group = [d];
                groups.push(group);
                lastGroupValue = groupValue;
            }
        }
        return groups;
    }

    const groupByKey = $derived(args.z || args.stroke);

    let groups = $derived(
        groupByKey && args.data.length > 0 ? groupIndex(args.data, groupByKey) : [args.data]
    );

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    type LinePath = (dr: DataRecord[]) => string;

    let linePath: LinePath = $derived(
        plot.scales.projection && curve === 'auto'
            ? sphereLine(plot.scales.projection)
            : callWithProps(line, [], {
                  curve: maybeCurve(curve === 'auto' ? 'linear' : curve, tension),
                  x: (d) => d.x,
                  y: (d) => d.y,
                  defined: (d) => isValid(d.x) && isValid(d.y)
              })
    );

    function sphereLine(projection) {
        const path = geoPath(projection);
        return (lineData: ScaledDataRecord[]) => {
            let line = [];
            const lines = [line];
            for (const { x, y } of lineData) {
                // if x or y is undefined, start a new line segment
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
</script>

<Mark
    type="line"
    channels={['x', 'y', 'opacity', 'stroke', 'strokeOpacity']}
    required={['x', 'y']}
    {...args}>
    {#snippet children({ mark, usedScales, scaledData })}
        {#if scaledData.length > 0}
            <g class={['lines', className]}>
                {#each groupIndex(scaledData, groupByKey) as lineData, i}
                    {@const pathString = linePath(lineData)}
                    {console.log({ lineData })}
                    {#if pathString}
                        <GroupMultiple class={resolveProp(lineClass, lineData[0])}>
                            {#if options.outlineStroke}
                                <path
                                    d={pathString}
                                    style={resolveScaledStyles(
                                        lineData[0],
                                        {
                                            ...args,
                                            stroke: options.outlineStroke,
                                            strokeWidth:
                                                options.outlineStrokeWidth ||
                                                (+options.strokeWidth || 1.4) + 2
                                        },
                                        { stroke: false },
                                        plot,
                                        'stroke'
                                    )} />
                            {/if}
                            <MarkerPath
                                {mark}
                                scales={plot.scales}
                                markerStart={args.markerStart}
                                markerMid={args.markerMid}
                                markerEnd={args.markerEnd}
                                marker={args.marker}
                                strokeWidth={args.strokeWidth}
                                datum={lineData[0]}
                                d={pathString}
                                color={lineData[0].stroke}
                                style={resolveScaledStyles(
                                    lineData[0].datum,
                                    args,
                                    usedScales,
                                    plot,
                                    'stroke'
                                )}
                                text={text ? resolveProp(text, lineData[0]) : null}
                                startOffset={resolveProp(args.textStartOffset, lineData[0], '50%')}
                                textStyle={resolveScaledStyles(
                                    lineData[0],
                                    {
                                        textAnchor: 'middle',
                                        ...pick(args, [
                                            'fontSize',
                                            'fontWeight',
                                            'fontStyle',
                                            'textAnchor'
                                        ]),
                                        fill: args.textFill || args.stroke,
                                        stroke: args.textStroke,
                                        strokeWidth: args.textStrokeWidth
                                    },
                                    usedScales,
                                    plot,
                                    'fill'
                                )} />
                        </GroupMultiple>
                    {/if}
                {/each}
            </g>
        {/if}
    {/snippet}
</Mark>

<style>
    /* todo: remove :global */
    .lines :global(path) {
        stroke-width: 1.4px;
        stroke-linejoin: round;
    }
</style>
