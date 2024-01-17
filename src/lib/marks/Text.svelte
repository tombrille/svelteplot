<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        DataRow
    } from '$lib/types.js';
    export type TextMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            text?: ChannelAccessor;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    
    const BaseMark_Text = BaseMark<BaseMarkProps & TextMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, ...channels } = $props<TextMarkProps>();

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }


</script>

<BaseMark_Text
    type="text"
    {data}
    channels={['x', 'y', 'text', 'fill', 'stroke']}
    {...channels}
>
    <g class="text">
        {#each data as datum, i}
            {@const cx = resolveChannel('x', datum, channels)}
            {@const cy = resolveChannel('y', datum, channels)}
            {@const maybeFillColor = resolveChannel('fill', datum, channels)}
            {@const maybeStrokeColor = resolveChannel('stroke', datum, channels)}
            <!-- {@const radius =
                typeof r === 'number'
                    ? r
                    : plot.radiusScale(resolveChannel('r', datum, channels))}
            {@const size = radius * radius * Math.PI} -->
           
            {#if isValid(cx) && isValid(cy)}
                <text
                    style={getBaseStyles(datum, channels)}
                    style:fill={maybeFillColor ? plot.colorScale(maybeFillColor) : maybeStrokeColor ? null : 'currentColor'}
                    style:stroke={maybeStrokeColor
                        ? plot.colorScale(maybeStrokeColor)
                        : null}
                    dominant-baseline="central"
                    transform="translate({[plot.xScale(cx), plot.yScale(cy)]})"
                >{resolveChannel('text', datum, channels)}</text>
            {/if}
        {/each}
    </g>
</BaseMark_Text>

<style>
    text {
        text-anchor: middle;
        fill: none;
        stroke: none;
        font-size: 13px;
        font-weight: 500;
        stroke-width: 1.6px;
    }
</style>
