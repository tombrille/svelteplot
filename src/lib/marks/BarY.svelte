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

    export type BarYMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            y1?: ChannelAccessor;
            y2?: ChannelAccessor;
            stack: StackOptions;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import { stackY } from '$lib/transforms/stack.js';
    import { recordizeY } from '$lib/transforms/recordize.js';

    const BaseMark_BarY = BaseMark<BaseMarkProps & BarYMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data: rawData, ...rawChannels } = $props<BarYMarkProps>();
    let { data, ...channels } = $derived(stackY(recordizeY({ data: rawData, ...rawChannels })));

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    // need to handle the case that just y is defined
</script>

<BaseMark_BarY type="bar-y" {data} channels={['x', 'y1', 'y2', 'fill', 'stroke']} {...channels}>
    <g class="bars-y">
        {#each data as datum}
            {@const cx = resolveChannel('x', datum, channels)}
            {@const cy1 = resolveChannel('y1', datum, channels)}
            {@const cy2 = resolveChannel('y2', datum, channels)}
            {@const miny = Math.min(plot.yScale(cy1), plot.yScale(cy2))}
            {@const maxy = Math.max(plot.yScale(cy1), plot.yScale(cy2))}
            {@const maybeFillColor = resolveChannel('fill', datum, channels)}
            {@const maybeStrokeColor = resolveChannel('stroke', datum, channels)}
            {#if isValid(cx) && isValid(cy1) && isValid(cy2)}
                <rect
                    style={getBaseStyles(datum, channels)}
                    style:fill={maybeFillColor
                        ? plot.colorScale(maybeFillColor)
                        : maybeStrokeColor
                          ? null
                          : 'currentColor'}
                    style:stroke={maybeStrokeColor ? plot.colorScale(maybeStrokeColor) : null}
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
