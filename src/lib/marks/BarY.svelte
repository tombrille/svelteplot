<!--
    @component
    For vertical column charts using a band scale as x axis
-->
<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { intervalY, stackY, recordizeY, sort } from '$lib/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import type {
        PlotContext,
        BaseMarkProps,
        RectMarkProps,
        ChannelAccessor,
        DataRow
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import { maybeData } from '$lib/helpers/index.js';
    import { addEventHandlers } from './helpers/events.js';
    import GroupMultiple from './helpers/GroupMultiple.svelte';

    type BarYProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        stack?: StackOptions;
        /**
         * Converts y into y1/y2 ranges based on the provided interval. Disables the
         * implicit stacking
         */
        interval?: number | string;
    } & RectMarkProps;

    let { data, class: className = null, stack, ...options }: BarYProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(
        stackY(
            intervalY(
                // by default, sort by x channel (the ordinal labels)
                sort(recordizeY({ data: maybeData(data), sort: { channel: 'x' }, ...options })),
                { plot }
            ),
            stack
        )
    );
</script>

<Mark
    type="barY"
    channels={['x', 'y1', 'y2', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}>
    {#snippet children({ mark, usedScales })}
        <GroupMultiple class="bar-y" length={args.data.length}>
            {#each args.data as datum}
                {@const x_ = resolveChannel('x', datum, args)}
                {@const y1_ = resolveChannel('y1', datum, args)}
                {@const y2_ = resolveChannel('y2', datum, args)}
                {@const x = usedScales.x ? projectX('x1', plot.scales, x_) : x_}
                {@const y1 = usedScales.y1 ? projectY('y1', plot.scales, y1_) : y1_}
                {@const y2 = usedScales.y2 ? projectY('y1', plot.scales, y2_) : y2_}
                {@const miny = Math.min(y1, y2)}
                {@const maxy = Math.max(y1, y2)}
                {@const inset = resolveProp(args.inset, datum, 0)}
                {@const dx = resolveProp(args.dx, datum, 0)}
                {@const dy = resolveProp(args.dy, datum, 0)}
                {#if isValid(x) && isValid(y1) && isValid(y2)}
                    <rect
                        class={className}
                        style={resolveScaledStyles(datum, args, usedScales, plot, 'fill')}
                        transform="translate({[x + inset + dx, miny + dy]})"
                        width={plot.scales.x.fn.bandwidth() - inset * 2}
                        height={maxy - miny}
                        rx={resolveProp(args.rx, datum, null)}
                        ry={resolveProp(args.ry, datum, null)}
                        use:addEventHandlers={{ getPlotState, options: mark.options, datum }} />
                {/if}
            {/each}
        </GroupMultiple>
    {/snippet}
</Mark>
