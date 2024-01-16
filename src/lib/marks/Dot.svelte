<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        DataRow
    } from '$lib/types.js';
    export type DotMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            r?: ChannelAccessor;
            rotate?: ChannelAccessor;
            symbol?: ChannelAccessor;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import { isSymbol, maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';

    const BaseMark_Dot = BaseMark<BaseMarkProps & DotMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, ...channels } = $props<DotMarkProps>();
    let { r = 3, symbol = 'circle' } = $derived(channels);
    let channelsWithDefaults = $derived({ ...channels, r, symbol });

    $inspect(channelsWithDefaults);

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    function getSymbolPath(symbolT, size) {
        const symbolType = isSymbol(symbolT)
            ? maybeSymbol(symbolT)
            : maybeSymbol(plot.symbolScale(symbolT));
        return d3Symbol(symbolType, size)();
    }
</script>

<BaseMark_Dot
    type="dot"
    {data}
    channels={['x', 'y', 'r', 'symbol', 'fill', 'stroke']}
    {...channels}
>
    <g class="dots">
        {#each data as datum, i}
            {@const cx = resolveChannel('x', datum, channelsWithDefaults)}
            {@const cy = resolveChannel('y', datum, channelsWithDefaults)}
            {@const maybeFillColor = resolveChannel('fill', datum, channelsWithDefaults)}
            {@const maybeStrokeColor = resolveChannel('stroke', datum, channelsWithDefaults)}
            {@const radius =
                typeof r === 'number'
                    ? r
                    : plot.radiusScale(resolveChannel('r', datum, channelsWithDefaults))}
            {@const size = radius * radius * Math.PI}
            {@const symbolT = resolveChannel('symbol', datum, channelsWithDefaults)}
            {@const symbolType = isSymbol(symbolT)
                ? maybeSymbol(symbolT)
                : maybeSymbol(plot.symbolScale(symbolT))}
            {#if isValid(cx) && isValid(cy)}
                <path
                    d={getSymbolPath(symbolType, size)}
                    style={getBaseStyles(datum, channels)}
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
