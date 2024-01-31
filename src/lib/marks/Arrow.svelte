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
        BaseMarkStyleProps,
        ConstantAccessor,
        ChannelAccessor
    } from '../types.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import { maybeSymbol } from '../helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { getUsedScales } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';

    let { data, ...options } = $props<
        BaseMarkStyleProps & {
            data: DataRecord[];
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
            children?: Snippet;
        }
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    function getSymbolPath(symbolType, size) {
        return d3Symbol(maybeSymbol(symbolType), size)();
    }
</script>

<Mark
    type="arrow"
    required={['x1', 'x2', 'y1', 'y2']}
    channels={['x1', 'y1', 'x2', 'y2', 'stroke']}
    {data}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}

    <g class="dots" data-use-x={useScale.x ? 1 : 0}>
        {#each data as datum}
            {#if options.filter == null || resolveProp(options.filter, datum)}
                {@const _x1 = resolveChannel('x1', datum, options)}
                {@const _x2 = resolveChannel('x2', datum, options)}
                {@const _y1 = resolveChannel('y2', datum, options)}
                {@const _y2 = resolveChannel('y2', datum, options)}
                {@const _stroke = resolveChannel('stroke', datum, options)}
                {#if isValid(_x1) && isValid(_x2) && isValid(_y1) && isValid(_y2)}
                    {@const x1 = useScale.x1 ? plot.scales.x.fn(_x1) : _x1}
                    {@const y1 = useScale.y1 ? plot.scales.y.fn(_y1) : _y1}
                    {@const x2 = useScale.x2 ? plot.scales.x.fn(_x2) : _x2}
                    {@const y2 = useScale.y2 ? plot.scales.y.fn(_y2) : _y2}
                    {@const dx = resolveProp(options.dx, datum, 0) as number}
                    {@const dy = resolveProp(options.dx, datum, 0)}
                    {@const stroke = useScale.stroke ? plot.scales.color.fn(_stroke) : _stroke}
                    
                    <path
                        d={getSymbolPath(symbol, size)}
                        transform="translate({x + dx}, {y + dy})"
                        data-symbol={symbol}
                        style={getBaseStyles(datum, options)}
                        style:fill={_fill ? fill : null}
                        style:stroke={_stroke ? stroke : fill ? null : 'currentColor'}
                    />
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    path {
        fill: none;
        stroke: none;
        stroke-width: 1.6px;
    }
</style>
