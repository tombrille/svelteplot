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
        ChannelAccessor
    } from '../types.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { coalesce } from '../helpers/index.js';
    import { getUsedScales } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';
    import {
        arrowPath,
        maybeSweep,
        type SweepFunc,
        type SweepOption
    } from '../helpers/arrowPath.js';

    let { data, ...options } = $props<
        BaseMarkProps & {
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
            bend?: ConstantAccessor<number>;
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
        }
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    let sorted = $derived(
        options.sort
            ? data.toSorted((a, b) =>
                  resolveChannel('sort', a, options) > resolveChannel('sort', b, options) ? 1 : -1
              )
            : data
    );
</script>

<Mark
    type="arrow"
    required={['x1', 'x2', 'y1', 'y2']}
    channels={['x1', 'y1', 'x2', 'y2', 'stroke']}
    data={sorted}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    {@const       sweep = maybeSweep(options.sweep) as SweepFunc}
    <g class="arrow" data-use-x={useScale.x ? 1 : 0}>
        {#each sorted as datum}
            {#if options.filter == null || resolveProp(options.filter, datum)}
                {@const _x1 = resolveChannel('x1', datum, options)}
                {@const _x2 = resolveChannel('x2', datum, options)}
                {@const _y1 = resolveChannel('y1', datum, options)}
                {@const _y2 = resolveChannel('y2', datum, options)}
                {@const _stroke = resolveChannel('stroke', datum, options)}
                {@const       strokeWidth = resolveProp(options.strokeWidth, datum, 1) as number}
                {#if isValid(_x1) && isValid(_x2) && isValid(_y1) && isValid(_y2) && (options.stroke == null || isValid(_stroke))}
                    {@const       x1 = (useScale.x1 ? plot.scales.x.fn(_x1) : _x1) as number}
                    {@const       y1 = (useScale.y1 ? plot.scales.y.fn(_y1) : _y1) as number}
                    {@const       x2 = (useScale.x2 ? plot.scales.x.fn(_x2) : _x2) as number}
                    {@const       y2 = (useScale.y2 ? plot.scales.y.fn(_y2) : _y2) as number}
                    {@const       dx = resolveProp(options.dx, datum, 0) as number}
                    {@const dy = resolveProp(options.dx, datum, 0)}
                    {@const inset = resolveProp(options.inset, datum, 0)}
                    {@const insetStart = resolveProp(options.insetStart, datum)}
                    {@const insetEnd = resolveProp(options.insetEnd, datum)}
                    {@const       headAngle = resolveProp(options.headAngle, datum, 60) as number}
                    {@const       headLength = resolveProp(options.headLength, datum, 8) as number}
                    {@const       bend = resolveProp(options.bend, datum, 0) as number|boolean}
                    {@const stroke = useScale.stroke ? plot.scales.color.fn(_stroke) : _stroke}
                    <path
                        data-stroke={_stroke}
                        d={arrowPath(
                            x1,
                            y1,
                            x2,
                            y2,
                            coalesce(insetStart, inset),
                            coalesce(insetEnd, inset),
                            headAngle,
                            headLength,
                            bend === true ? 22.5 : bend === false ? 0 : bend,
                            strokeWidth,
                            sweep
                        )}
                        transform={dx || dy ? `translate(${dx}, ${dy})` : null}
                        style={getBaseStyles(datum, options)}
                        style:stroke={_stroke != null ? stroke : 'currentColor'}
                    />
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    path {
        fill: none;
        stroke-width: 1.6px;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
</style>
