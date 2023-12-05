<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import type { BaseMarkProps, DotMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';
    import { symbol as d3Symbol, type SymbolType } from 'd3-shape';
    import { isSymbol, maybeSymbol } from '$lib/helpers/symbols';

    const BaseMark_Dot = BaseMark<BaseMarkProps & DotMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, x = null, y = null, r = 3, symbol = 'circle', ...styleProps } = $props<DotMarkProps>();

    let styleProps2 = $derived({ ...styleProps, ...(!styleProps.fill && !styleProps.stroke ? { stroke: 'currentColor' } : {}) });

    function isValid(value:number|Date|string|null): value is number|Date|string {
        return value !== null && !Number.isNaN(value);
    }
    $effect(() => console.log(data));
    // console.log({r,data}, plot.radius.domain, plot.radiusScale(resolveChannel('radius', data[0], r)))
</script>

<BaseMark_Dot type="dot" {data} channels={['x', 'y', 'radius']} {x} {y} {r} {...styleProps}>
    <g class="dots">
        {#each data as datum, i}
            {@const cx = resolveChannel('x', datum, x)}
            {@const cy = resolveChannel('y', datum, y)}
            {@const symbolT = resolveChannel('symbol', datum, symbol) as string|SymbolType}
            {@const symbolType = isSymbol(symbolT) ? maybeSymbol(symbolT) : maybeSymbol(plot.symbolScale(symbolT))}
            {@const radius = typeof r === 'number' ? r : plot.radiusScale(resolveChannel('radius', datum, r))}
            {@const size = radius * radius  * Math.PI}
            {#if isValid(cx) && isValid(cy)}
                <path
                    d={d3Symbol(symbolType, size)()}
                    style={getBaseStyles(datum, styleProps2)}
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
        stroke-width: 1.4px;
    }
</style>
