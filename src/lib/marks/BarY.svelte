<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        DataRow
    } from '$lib/types.js';
    export type BarYMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            y1?: ChannelAccessor;
            y2?: ChannelAccessor;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import { isSymbol, maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';

    const BaseMark_BarY = BaseMark<BaseMarkProps & BarYMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, ...channels } = $props<BarYMarkProps>();
    let { r = 3, symbol = 'circle' } = $derived(channels);
    let channelsWithDefaults = $derived({ ...channels, r, symbol });

    $inspect(channelsWithDefaults);

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

</script>

<BaseMark_BarY
    type="bar-y"
    {data}
    channels={['x', 'y1', 'y2', 'fill', 'stroke']}
    {...channels}
>
    <g class="bars-y">
        {#each data as datum, i}
            {@const cx = resolveChannel('x', datum, channelsWithDefaults)}
            {@const cy1 = resolveChannel('y1', datum, channelsWithDefaults)}
            {@const cy2 = resolveChannel('y2', datum, channelsWithDefaults)}
            {@const miny = Math.min(plot.yScale(cy1), plot.yScale(cy2))}
            {@const maxy = Math.max(plot.yScale(cy1), plot.yScale(cy2))}
            {@const maybeFillColor = resolveChannel('fill', datum, channelsWithDefaults)}
            {@const maybeStrokeColor = resolveChannel('stroke', datum, channelsWithDefaults)}
            {#if isValid(cx) && isValid(cy1) && isValid(cy2)}
                <rect
                    style={getBaseStyles(datum, channels)}
                    style:fill={maybeFillColor ? plot.colorScale(maybeFillColor) : maybeStrokeColor ? null : 'currentColor'}
                    style:stroke={maybeStrokeColor
                        ? plot.colorScale(maybeStrokeColor)
                        : null}
                    transform="translate({[plot.xScale(cx), miny]})"
                    height={maxy - miny}
                    width={plot.xScale.bandwidth()}
                />
            {/if}
        {/each}
    </g>
</BaseMark_BarY>

<style>
    rect {
        fill: none;
        stroke: none;
        stroke-width: 1.6px;
    }
</style>
