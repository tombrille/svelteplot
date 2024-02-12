<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext, type Snippet } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor
    } from '../types.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { maybeSymbol } from '../helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { getUsedScales } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';

    let { data, ...options } = $props<
        BaseMarkProps & {
            data: DataRecord[];
            x: ChannelAccessor;
            y: ChannelAccessor;
            r?: ChannelAccessor;
            fill?: ChannelAccessor;
            stroke?: ChannelAccessor;
            children?: Snippet;
            dx?: ConstantAccessor<number>;
            dy?: ConstantAccessor<number>;
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

    const { getTestFacet } = getContext('facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="dot"
    required={['x', 'y']}
    channels={['x', 'y', 'fx', 'fy', 'r', 'symbol', 'fill', 'stroke', 'fillOpacity', 'strokeOpacity']}
    {data}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}

    <g class="dots" data-use-x={useScale.x ? 1 : 0}>
        {#each data as datum}
            {#if options.filter == null || resolveProp(options.filter, datum)}
                {#if testFacet(datum, mark.options)}
                    {@const _x = resolveChannel('x', datum, options)}
                    {@const _y = resolveChannel('y', datum, options)}
                    {@const _r = resolveChannel('r', datum, { r: 3, ...options })}
                    {#if isValid(_x) && isValid(_y) && isValid(_r)}
                        {@const x = useScale.x ? plot.scales.x.fn(_x) : _x}
                        {@const y = useScale.y ? plot.scales.y.fn(_y) : _y}
                        {@const          dx = resolveProp(options.dx, datum, 0) as number}
                        {@const dy = resolveProp(options.dx, datum, 0)}
                        {@const r = useScale.r ? +plot.scales.r.fn(_r) : +_r}
                        {@const size = r * r * Math.PI}
                        {@const symbol_ = resolveChannel('symbol', datum, {
                            symbol: 'circle',
                            ...options
                        })}
                        {@const symbol = useScale.symbol ? plot.scales.symbol.fn(symbol_) : symbol_}
                        <path
                            d={getSymbolPath(symbol, size)}
                            transform="translate({x + dx}, {y + dy})"
                            data-symbol={symbol}
                            style={getBaseStyles(datum, options)}
                            {...resolveScaledStyles(datum, options, useScale, plot, 'stroke')}
                        />
                    {/if}
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    path {
        stroke-width: 1.6px;
    }
</style>
