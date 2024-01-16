<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        RawValue,
        DataRow
    } from '$lib/types.js';
    import type { StackOptions } from '$lib/transforms/stack.js';

    export type BarXMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            x1?: ChannelAccessor;
            x2?: ChannelAccessor;
            y?: ChannelAccessor;
            inset: number;
            stack: StackOptions;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import { stackX } from '$lib/transforms/stack.js';
    import { recordizeX } from '$lib/transforms/recordize.js';

    const BaseMark_BarX = BaseMark<BaseMarkProps & BarXMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data: rawData, inset = 0, ...rawChannels } = $props<BarXMarkProps>();
    let { data, ...channels } = $derived(stackX(recordizeX({ data: rawData, ...rawChannels })));

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    // need to handle the case that just y is defined
</script>

<BaseMark_BarX type="bar-x" {data} channels={['y', 'x1', 'x2', 'fill', 'stroke']} {...channels}>
    <g class="bars-x">
        {#each data as datum}
            {@const cy = resolveChannel('y', datum, channels)}
            {@const cx1 = resolveChannel('x1', datum, channels)}
            {@const cx2 = resolveChannel('x2', datum, channels)}
            {@const minx = Math.min(plot.xScale(cx1), plot.xScale(cx2))}
            {@const maxx = Math.max(plot.xScale(cx1), plot.xScale(cx2))}
            {@const maybeFillColor = resolveChannel('fill', datum, channels)}
            {@const maybeStrokeColor = resolveChannel('stroke', datum, channels)}
            {#if isValid(cy) && isValid(cx1) && isValid(cx2)}
                <rect
                    style={getBaseStyles(datum, channels)}
                    style:fill={maybeFillColor
                        ? plot.colorScale(maybeFillColor)
                        : maybeStrokeColor
                          ? null
                          : 'currentColor'}
                    style:stroke={maybeStrokeColor ? plot.colorScale(maybeStrokeColor) : null}
                    transform="translate({[minx, plot.yScale(cy) + inset]})"
                    width={maxx - minx}
                    height={plot.yScale.bandwidth() - inset * 2}
                />
            {/if}
        {/each}
    </g>
</BaseMark_BarX>

<style>
    rect {
        fill: none;
        stroke: none;
        stroke-width: 1.6px;
    }
</style>
