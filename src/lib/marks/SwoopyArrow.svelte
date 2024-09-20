<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext,
        RawValue
    } from '../types.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { coalesce, maybeData, testFilter, maybeNumber } from '../helpers/index.js';
    import { projectXY } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';
    import { arrowPath, maybeSweep, type SweepOption } from '../helpers/arrowPath.js';
    import { replaceChannels } from '$lib/transforms/rename.js';
    import { addEventHandlers } from './helpers/events.js';
    import GroupMultiple from './helpers/GroupMultiple.svelte';

    type ArrowProps = BaseMarkProps & {
        data: DataRecord[];
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
        /**
         * anchor point, aka where the arrow points to
         */
        x: ChannelAccessor;
        y: ChannelAccessor;
        /**
         * relative offset of the arrowhead, aka, where the arrow starts at
         */
        tx: ConstantAccessor<number>;
        ty: ConstantAccessor<number>;

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

    let args: ArrowProps = $derived({ data: sorted, ...options });

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="swoopyArrow"
    required={['x', 'y']}
    channels={['x', 'y', 'fx', 'fy', 'fz', 'opacity', 'stroke', 'strokeOpacity']}
    {...args}>
    {#snippet children({ mark, usedScales })}
        {@const sweep = maybeSweep(args.sweep)}
        <GroupMultiple class="arrow" length={args.data.length}>
            {#each args.data as datum}
                {#if testFilter(datum, args) && testFacet(datum, mark.options)}
                    {@const _x = resolveChannel('x', datum, args)}
                    {@const _y = resolveChannel('y', datum, args)}
                    {@const strokeWidth = resolveProp(args.strokeWidth, datum, 1)}
                    {#if isValid(_x) && isValid(_y)}
                        {@const [x, y] = projectXY(plot.scales, _x, _y, usedScales.x, usedScales.y)}
                        {@const tx = +resolveProp(args.tx, datum, 0)}
                        {@const ty = +resolveProp(args.ty, datum, 0)}
                        {@const dx = resolveProp(args.dx, datum, 0)}
                        {@const dy = resolveProp(args.dx, datum, 0)}
                        {@const inset = resolveProp(args.inset, datum, 0)}
                        {@const insetStart = resolveProp(args.insetStart, datum)}
                        {@const insetEnd = resolveProp(args.insetEnd, datum)}
                        {@const headAngle = resolveProp(args.headAngle, datum, 60)}
                        {@const headLength = resolveProp(args.headLength, datum, 8)}
                        {@const bend = resolveProp(args.bend, datum, 0)}
                        {@const arrPath = arrowPath(
                            x + tx,
                            y + ty,
                            x,
                            y,
                            maybeNumber(coalesce(insetStart, inset)),
                            maybeNumber(coalesce(insetEnd, inset)),
                            headAngle,
                            headLength,
                            bend === true ? 22.5 : bend === false ? 0 : bend,
                            strokeWidth,
                            sweep
                        )}
                        <g
                            transform={dx || dy ? `translate(${dx}, ${dy})` : null}
                            use:addEventHandlers={{
                                getPlotState,
                                options: mark.options,
                                datum
                            }}>
                            {#if options.onmouseenter || options.onclick}
                                <!-- add invisible path in bg for easier mouse access -->
                                <path
                                    d={arrPath}
                                    style="fill:none;stroke-width: {(strokeWidth || 1) +
                                        10}; stroke: red; stroke-opacity:0" />
                            {/if}
                            <path
                                d={arrPath}
                                style={resolveScaledStyles(
                                    datum,
                                    args,
                                    usedScales,
                                    plot,
                                    'stroke'
                                )} />
                        </g>
                    {/if}
                {/if}
            {/each}
        </GroupMultiple>
    {/snippet}
</Mark>

<style>
    path {
        stroke-width: 1.6px;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
</style>
