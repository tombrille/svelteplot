<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, DotMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';
    import { symbol as d3Symbol } from 'd3-shape';
    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { isSymbol, maybeSymbol } from '$lib/helpers/symbols.js';

    const BaseMark_Dot = BaseMark<BaseMarkProps & DotMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        data,
        x = null,
        y = null,
        r = 3,
        symbol = 'circle',
        stroke = null,
        fill = null,
        ...styleProps
    } = $props<DotMarkProps>();

    let styleProps2 = $derived({
        ...styleProps,
        ...(!styleProps.fill && !styleProps.stroke ? { stroke: 'currentColor' } : {})
    });

    function isValid(value: number | Date | string | null): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }
</script>

<BaseMark_Dot
    type="dot"
    {data}
    channels={[
        ...(x ? ['x'] : []),
        ...(y ? ['y'] : []),
        ...(r ? ['radius'] : []),
        ...(symbol ? ['symbol'] : []),
        ...(fill || stroke ? ['color'] : [])
    ]}
    {x}
    {y}
    {r}
    {fill}
    {stroke}
    {symbol}
    {...styleProps}
>
    <g class="dots">
        {#each data as datum, i}
            {@const cx = resolveChannel('x', datum, x)}
            {@const cy = resolveChannel('y', datum, y)}
            {@const symbolT = resolveChannel('symbol', datum, symbol)}
            {@const symbolType = isSymbol(symbolT)
                ? maybeSymbol(symbolT)
                : maybeSymbol(plot.symbolScale(symbolT))}
            {@const radius =
                typeof r === 'number' ? r : plot.radiusScale(resolveChannel('radius', datum, r))}
            {@const size = radius * radius * Math.PI}
            {@const maybeFillColor = resolveChannel('color', datum, fill)}
            {@const maybeStrokeColor = resolveChannel('color', datum, stroke)}
            {#if isValid(cx) && isValid(cy)}
                <path
                    d={d3Symbol(symbolType, size)()}
                    style={getBaseStyles(datum, styleProps)}
                    style:fill={maybeFillColor ? plot.colorScale(maybeFillColor) : null}
                    style:stroke={maybeStrokeColor
                        ? plot.colorScale(maybeStrokeColor)
                        : maybeFillColor
                          ? null
                          : 'currentColor'}
                    transform="translate({[plot.xScale(cx), plot.yScale(cy)]})"
                />
            {/if}
        {/each}
    </g>
</BaseMark_Dot>

<style>
    path {
        fill: none;
        stroke: none;
        stroke-width: 1.6px;
    }
</style>
