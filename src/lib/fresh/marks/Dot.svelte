<script lang="ts">
    import { getContext } from 'svelte';
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
            x: ChannelAccessor;
            y: ChannelAccessor;
            r?: ChannelAccessor;
            fill?: ChannelAccessor;
            stroke?: ChannelAccessor;
            dx?: ConstantAccessor<number>;
            dy?: ConstantAccessor<number>;
        }
    >();

    const { state } = getContext<PlotContext>('svelteplot');
    let plot = $derived(state());

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    function getSymbolPath(symbolType, size) {
        return d3Symbol(maybeSymbol(symbolType), size)();
    }
</script>

<Mark
    type="dot"
    required={['x', 'y']}
    channels={['x', 'y', 'r', 'symbol', 'fill', 'stroke']}
    {data}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}

    <g class="dots" data-use-x={useScale.x ? 1 : 0}>
        {#each data as datum}
            {@const _x = resolveChannel('x', datum, options)}
            {@const _y = resolveChannel('y', datum, options)}
            {@const _r = resolveChannel('r', datum, { r: 3, ...options })}
            {@const _fill = resolveChannel('fill', datum, options)}
            {@const _stroke = resolveChannel('stroke', datum, options)}
            {#if isValid(_x) && isValid(_y) && isValid(_r)}
                {@const x = useScale.x ? plot.scales.x.fn(_x) : _x}
                {@const y = useScale.y ? plot.scales.y.fn(_y) : _y}
                {@const dx = resolveProp(options.dx, datum, 0) as number}
                {@const dy = resolveProp(options.dx, datum, 0)}
                {@const r = useScale.r ? plot.scales.r.fn(_r) : _r}
                {@const size = r * r * Math.PI}
                {@const symbol_ = resolveChannel('symbol', datum, { symbol: 'circle', ...options })}
                {@const symbol = useScale.symbol ? plot.scales.symbol.fn(symbol_) : symbol_}
                {@const fill = useScale.fill ? plot.scales.color.fn(_fill) : _fill}
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
