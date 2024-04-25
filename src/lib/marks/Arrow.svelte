<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { coalesce, maybeData, testFilter, maybeNumber } from '../helpers/index.js';
    import { projectXY } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';
    import { arrowPath, maybeSweep, type SweepOption } from '../helpers/arrowPath.js';
    import { replaceChannels } from '$lib/transforms/rename.js';
    import { addEventHandlers } from './helpers/events.js';

    type ArrowProps = BaseMarkProps & {
        data: DataRecord[];
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
        x1: ChannelAccessor;
        y1: ChannelAccessor;
        x2: ChannelAccessor;
        y2: ChannelAccessor;
        stroke?: ChannelAccessor;
        /**
         * the bend angle, in degrees; defaults to 0°; true for 22.5°
         */
        bend?: ConstantAccessor<number> | true;
        /**
         * the arrowhead angle, in degrees; defaults to 60°
         */
        headAngle?: ConstantAccessor<number>;
        /**
         * the arrowhead scale; defaults to 8
         */
        headLength?: ConstantAccessor<number>;
        /**
         * inset at the end of the arrow (useful if the arrow points to a dot)
         */
        insetEnd?: ConstantAccessor<number>;
        /**
         * inset at the start of the arrow
         */
        insetStart?: ConstantAccessor<number>;
        /**
         * shorthand for the two insets
         */
        inset?: ConstantAccessor<number>;
        sweep?: SweepOption;
        children?: Snippet;
    };

    let { data, ...options }: ArrowProps = $props();

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

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="arrow"
    required={['x1', 'x2', 'y1', 'y2']}
    channels={['x1', 'y1', 'x2', 'y2', 'fx', 'fy', 'fz', 'opacity', 'stroke', 'strokeOpacity']}
    {...args}
>
    {#snippet children({ mark, usedScales })}
        {@const sweep = maybeSweep(args.sweep)}
        <g class="arrow" data-use-x={usedScales.x ? 1 : 0}>
            {#each args.data as datum}
                {#if testFilter(datum, args) && testFacet(datum, mark.options)}
                    {@const _x1 = resolveChannel('x1', datum, args)}
                    {@const _x2 = resolveChannel('x2', datum, args)}
                    {@const _y1 = resolveChannel('y1', datum, args)}
                    {@const _y2 = resolveChannel('y2', datum, args)}
                    {@const strokeWidth = resolveProp(args.strokeWidth, datum, 1)}
                    {#if isValid(_x1) && isValid(_x2) && isValid(_y1) && isValid(_y2)}
                        {@const [x1, y1] = projectXY(
                            plot.scales,
                            _x1,
                            _y1,
                            usedScales.x1,
                            usedScales.y1
                        )}
                        {@const [x2, y2] = projectXY(
                            plot.scales,
                            _x2,
                            _y2,
                            usedScales.x2,
                            usedScales.y2
                        )}
                        {@const dx = resolveProp(args.dx, datum, 0)}
                        {@const dy = resolveProp(args.dx, datum, 0)}
                        {@const inset = resolveProp(args.inset, datum, 0)}
                        {@const insetStart = resolveProp(args.insetStart, datum)}
                        {@const insetEnd = resolveProp(args.insetEnd, datum)}
                        {@const headAngle = resolveProp(args.headAngle, datum, 60)}
                        {@const headLength = resolveProp(args.headLength, datum, 8)}
                        {@const bend = resolveProp(args.bend, datum, 0)}
                        {@const arrPath = arrowPath(
                            x1,
                            y1,
                            x2,
                            y2,
                            maybeNumber(coalesce(insetStart, inset)),
                            maybeNumber(coalesce(insetEnd, inset)),
                            headAngle,
                            headLength,
                            bend === true ? 22.5 : bend === false ? 0 : bend,
                            strokeWidth,
                            sweep
                        )}
                        <g
                            data-y1={_y1}
                            data-y1_={y1}
                            transform={dx || dy ? `translate(${dx}, ${dy})` : null}
                            use:addEventHandlers={{
                                scales: plot.scales,
                                options: mark.options,
                                datum
                            }}
                        >
                            {#if options.onmouseenter || options.onclick}
                                <!-- add invisible path in bg for easier mouse access -->
                                <path
                                    d={arrPath}
                                    style="fill:none;stroke-width: {(strokeWidth || 1) +
                                        10}; stroke: red; stroke-opacity:0"
                                />
                            {/if}
                            <path
                                d={arrPath}
                                style={resolveScaledStyles(datum, args, usedScales, plot, 'stroke')}
                            />
                        </g>
                    {/if}
                {/if}
            {/each}
        </g>
    {/snippet}
</Mark>

<style>
    path {
        stroke-width: 1.6px;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
</style>
