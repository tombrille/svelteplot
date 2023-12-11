<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        ChannelName,
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
    import type { Plot } from '$lib/classes/Plot.svelte';
    import { getContext } from 'svelte';
    import { symbol as d3Symbol } from 'd3-shape';
    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { isSymbol, maybeSymbol } from '$lib/helpers/symbols.js';

    const BaseMark_Dot = BaseMark<BaseMarkProps & DotMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, ...channels } = $props<DotMarkProps>();

    function isValid(value: number | Date | string | null): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    let { r = 3, symbol = 'circle' } = $derived(channels);
    let channelsWithDefaults = $derived({ ...channels, r, symbol });

    $inspect({ col: plot.color.marks.length });
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
            {@const symbolT = resolveChannel('symbol', datum, channelsWithDefaults)}
            {@const symbolType = isSymbol(symbolT)
                ? maybeSymbol(symbolT)
                : maybeSymbol(plot.symbolScale(symbolT))}
            {@const radius =
                typeof r === 'number'
                    ? r
                    : plot.radiusScale(resolveChannel('r', datum, channelsWithDefaults))}
            {@const size = radius * radius * Math.PI}
            {@const maybeFillColor = resolveChannel('fill', datum, channelsWithDefaults)}
            {@const maybeStrokeColor = resolveChannel('stroke', datum, channelsWithDefaults)}
            {#if isValid(cx) && isValid(cy)}
                <path
                    d={d3Symbol(symbolType, size)()}
                    style={getBaseStyles(datum, channelsWithDefaults)}
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
