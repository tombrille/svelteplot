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

    export type BaseLineMarkProps = {
        data: DataRecord[];
        z?: ChannelAccessor;
        stroke?: ChannelAccessor;
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
    import pick from 'underscore/modules/pick.js';

    type LineMarkProps = BaseMarkProps & {
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    } & BaseLineMarkProps;

    import type { RawValue } from '$lib/types.js';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import { isValid } from '$lib/helpers/index.js';
    import { sort } from '$lib/transforms/sort.js';
    import { recordizeXY } from '$lib/transforms/recordize.js';

    let { data, curve = 'auto', tension = 0, text, ...options }: LineMarkProps = $props();

    let args = $derived(sort(recordizeXY({ data, ...options })));

    function groupIndex(data, groupByKey) {
        let group = [];
        const groups = [group];
        let lastGroupValue;
        for (const d of data) {
            const groupValue = resolveProp(groupByKey, d);
            // console.log({d, groupValue})
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
        // return Object.values(groupBy(args.data, (d) => ))
    }

    let groups = $derived(
        groupByKey && args.data.length > 0 ? groupIndex(args.data, groupByKey) : [args.data]
    );

    let groupByKey = $derived(args.z || args.stroke);

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    type LinePath = (dr: DataRecord[]) => string;

    let linePath: LinePath = $derived(
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
            const [__px, __py] = projectXY(
                plot.scales,
                resolveChannel('x', d, args),
                resolveChannel('y', d, args),
                true,
                true
            );
            return { ...d, __px, __py };
        });
    }
</script>

<Mark
    type="line"
    channels={['x', 'y', 'opacity', 'stroke', 'strokeOpacity', 'fx', 'fy', 'fz']}
    required={['x', 'y']}
    {...args}
>
    {#snippet children({ mark, usedScales })}
        {#if data.length > 0}
            <g class="lines">
                {#each groups as lineData, i}
                    {#if testFacet(lineData[0], mark.options) && lineData.length > 0}
                        {@const dx_ = resolveProp(args.dx, lineData[0], 0)}
                        {@const dy_ = resolveProp(args.dy, lineData[0], 0)}
                        {@const markerColor_ =
                            resolveChannel('stroke', lineData[0], args, true) || 'currentColor'}
                        {@const markerColor = usedScales.stroke
                            ? plot.scales.color.fn(markerColor_)
                            : markerColor_}
                        <MarkerPath
                            {mark}
                            scales={plot.scales}
                            markerStart={args.markerStart}
                            markerMid={args.markerMid}
                            markerEnd={args.markerEnd}
                            marker={args.marker}
                            strokeWidth={args.strokeWidth}
                            datum={lineData[0]}
                            d={linePath(
                                projectLineData(
                                    args.filter == null
                                        ? lineData
                                        : lineData.filter((d) => resolveProp(args.filter, d)),
                                    plot
                                )
                            )}
                            color={markerColor}
                            style={resolveScaledStyles(
                                lineData[0],
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
                                    ...pick(
                                        args,
                                        'fontSize',
                                        'fontWeight',
                                        'fontStyle',
                                        'textAnchor'
                                    ),
                                    fill: args.textFill || args.stroke,
                                    stroke: args.textStroke,
                                    strokeWidth: args.textStrokeWidth
                                },
                                usedScales,
                                plot,
                                'fill'
                            )}
                            transform={dx_ || dy_ ? `translate(${dx_},${dy_})` : null}
                        />
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
