<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        DataRow,
        ConstantAccessor,
        DataRecord
    } from '$lib/types.js';

    type GlobalCSSValues = 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';

    export type TextMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRecord[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            rotate?: ChannelAccessor | ConstantAccessor<number>;
            fontSize?: ChannelAccessor | ConstantAccessor<number>;
            // constant options
            text: ConstantAccessor<string>;
            textAnchor?: ConstantAccessor<'start' | 'middle' | 'end'>;
            lineAnchor?: ConstantAccessor<'top' | 'bottom' | 'middle'>;
            frameAnchor?: ConstantAccessor<'top' | 'middle' | 'bottom' | 'left' | 'right'>;
            lineWidth?: ConstantAccessor<number>;
            // textOverflow: ConstantAccessor<number>;
            monospace?: ConstantAccessor<boolean>;
            fontFamily?: ConstantAccessor<string>;
            fontStyle?: ConstantAccessor<string>;
            fontVariant?: ConstantAccessor<string>;
            fontWeight?: ConstantAccessor<
                'normal' | 'light' | 'lighter' | 'bold' | 'bolder' | number | GlobalCSSValues
            >;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveProp, resolveChannel } from '$lib/helpers/resolve.js';

    const BaseMark_Text = BaseMark<BaseMarkProps & TextMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data, text, x, y, fill, stroke, fontSize, rotate, ...otherProps } =
        $props<TextMarkProps>();
    let channels = $derived({ x, y, fill, stroke, fontSize, rotate });

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }
</script>

<BaseMark_Text
    type="text"
    {data}
    channels={['x', 'y', 'fill', 'stroke', 'fontSize', 'rotate']}
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
                    : plot.radiusScale(resolveProp('r', datum, channels))}
            {@const size = radius * radius * Math.PI} -->

            {#if isValid(cx) && isValid(cy)}
                <text
                    style={getBaseStyles(datum, otherProps)}
                    style:fill={maybeFillColor
                        ? plot.colorScale(maybeFillColor)
                        : maybeStrokeColor
                          ? null
                          : 'currentColor'}
                    style:stroke={maybeStrokeColor ? plot.colorScale(maybeStrokeColor) : null}
                    dominant-baseline="central"
                    transform="translate({[plot.xScale(cx), plot.yScale(cy)]})"
                    >{resolveProp(text, datum, '')}</text
                >
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
