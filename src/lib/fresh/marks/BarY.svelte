<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { stackY, recordizeY } from '$lib/index.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { getUsedScales } from '../helpers/scales.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkStyleProps,
        ConstantAccessor,
        RectMarkProps,
        ChannelAccessor
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { wrapEvent } from '../helpers/wrapEvent.js';
    import type { StackOptions } from '$lib/transforms/stack.js';

    let { data, stack, onclick, onmouseenter, onmouseleave, ...options } = $props<
        BaseMarkStyleProps & {
            data: DataRecord[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            y1?: ChannelAccessor;
            y2?: ChannelAccessor;
            stack?: StackOptions
        } & RectMarkProps
    >();

    let args = $derived(stackY(recordizeY({ data, ...options }), stack));

    const { state } = getContext<PlotContext>('svelteplot');
    let plot = $derived(state());
</script>

<Mark type="barY" channels={['x', 'y1', 'y2', 'fill', 'stroke', 'opacity']} {...args} let:mark>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g class="bars-y">
        {#each args.data as datum}
            {@const x_ = resolveChannel('x', datum, args)}
            {@const y1_ = resolveChannel('y1', datum, args)}
            {@const y2_ = resolveChannel('y2', datum, args)}
            {@const x = (useScale.x ? plot.scales.x.fn(x_) : x_) as number}
            {@const y1 = (useScale.y1 ? plot.scales.y.fn(y1_) : y1_) as number}
            {@const y2 = (useScale.y2 ? plot.scales.y.fn(y2_) : y2_) as number}
            {@const miny = Math.min(y1 as number, y2 as number)}
            {@const maxy = Math.max(y1 as number, y2 as number)}
            {@const fill_ = resolveChannel('fill', datum, args)}
            {@const stroke_ = resolveChannel('stroke', datum, args)}
            {@const fill = (useScale.fill ? plot.scales.color.fn(fill_) : fill_) as string}
            {@const stroke = (useScale.stroke ? plot.scales.color.fn(stroke_) : stroke_) as string}
            {@const inset = resolveProp(args.inset, datum as DataRecord, 0) as number}
            {@const dx = resolveProp(args.dx, datum as DataRecord, 0) as number}
            {@const dy = resolveProp(args.dy, datum as DataRecord, 0) as number}
            {#if isValid(x) && isValid(y1) && isValid(y2)}
                <rect
                    style={getBaseStyles(datum, args)}
                    style:fill={fill_ ? fill : stroke_ ? null : 'currentColor'}
                    style:stroke={stroke_ ? stroke : null}
                    transform="translate({[x + inset + dx, miny + dy]})"
                    width={plot.scales.x.fn.bandwidth() - inset * 2}
                    height={maxy - miny}
                    role={onclick ? 'button' : null}
                    rx={resolveProp(args.rx, datum, null)}
                    ry={resolveProp(args.ry, datum, null)}
                    onclick={onclick && wrapEvent(onclick, datum)}
                    onmouseenter={onmouseenter && wrapEvent(onmouseenter, datum)}
                    onmouseleave={onmouseleave && wrapEvent(onmouseleave, datum)}
                />
            {/if}
        {/each}
    </g>
</Mark>

<style>
    rect {
        stroke: none;
        fill: none;
    }
</style>
