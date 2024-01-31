<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        RawValue,
        DataRow,
        ConstantAccessor,
        DataRecord
    } from '$lib/types.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type { MouseEventHandler } from 'svelte/elements';
    export type BarYMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            y1?: ChannelAccessor;
            y2?: ChannelAccessor;
            stack: StackOptions;
            inset: ConstantAccessor<number>;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveProp, resolveChannel } from '$lib/helpers/resolve.js';
    import { stackY } from '$lib/transforms/stack.js';
    import { recordizeY } from '$lib/transforms/recordize.js';

    const BaseMark_BarY = BaseMark<BaseMarkProps & BarYMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        data: rawData,
        onclick,
        dx,
        dy,
        onmouseenter,
        onmouseleave,
        ...rawChannels
    } = $props<BarYMarkProps>();
    let { data, inset, ...channels } = $derived(
        stackY(recordizeY({ data: rawData, ...rawChannels }))
    );

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    function wrapEvent(handler, d) {
        return handler ? () => handler(d.___orig___ !== undefined ? d.___orig___ : d) : null;
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
            {@const inset_ = resolveProp(inset, datum as DataRecord, 0) as number}
            {@const dx_ = resolveProp(dx, datum as DataRecord, 0) as number}
            {@const dy_ = resolveProp(dy, datum as DataRecord, 0) as number}
            {#if isValid(cx) && isValid(cy1) && isValid(cy2)}
                <rect
                    style={getBaseStyles(datum, channels)}
                    style:fill={maybeFillColor
                        ? plot.colorScale(maybeFillColor)
                        : maybeStrokeColor
                          ? null
                          : 'currentColor'}
                    style:stroke={maybeStrokeColor ? plot.colorScale(maybeStrokeColor) : null}
                    transform="translate({[plot.xScale(cx) + inset_ + dx_, miny + dy_]})"
                    height={maxy - miny}
                    width={plot.xScale.bandwidth() - inset_ * 2}
                    role={onclick ? 'button' : null}
                    onclick={wrapEvent(onclick, datum)}
                    onmouseenter={wrapEvent(onmouseenter, datum)}
                    onmouseleave={wrapEvent(onmouseleave, datum)}
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
