<!--
    @component
    For horizontal bar charts using a band scale as y axis
-->
<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { stackX, recordizeX, intervalX, sort } from '$lib/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import type { PlotContext, BaseMarkProps, RectMarkProps, ChannelAccessor } from '../types.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type { DataRow } from '$lib/types.js';
    import { isValid, testFilter } from '$lib/helpers/index.js';
    import { addEventHandlers } from './helpers/events.js';

    type BarXProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
        stack?: StackOptions;
    } & RectMarkProps;

    let { data, stack, ...options }: BarXProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(
        stackX(
            intervalX(
                // by default, sort by y channel (the ordinal labels)
                sort(recordizeX({ data, sort: { channel: 'y' }, ...options })),
                { plot }
            ),
            stack
        )
    );
</script>

<Mark
    type="barX"
    channels={['x1', 'x2', 'y', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}
>
    {#snippet children({ mark, usedScales })}
        <g class="bars-x">
            {#each args.data as datum}
                {#if testFilter(datum, args)}
                    {@const y_ = resolveChannel('y', datum, args)}
                    {@const x1_ = resolveChannel('x1', datum, args)}
                    {@const x2_ = resolveChannel('x2', datum, args)}
                    {@const x1 = usedScales.x1 ? projectX('x1', plot.scales, x1_) : x1_}
                    {@const x2 = usedScales.x2 ? projectX('x1', plot.scales, x2_) : x2_}
                    {@const y = usedScales.y ? projectY('y1', plot.scales, y_) : y_}
                    {@const minx = Math.min(x1, x2)}
                    {@const maxx = Math.max(x1, x2)}
                    {@const inset = resolveProp(args.inset, datum, 0)}
                    {@const dx = resolveProp(args.dx, datum, 0)}
                    {@const dy = resolveProp(args.dy, datum, 0)}
                    {#if isValid(y) && isValid(x1) && isValid(x2)}
                        <rect
                            style={resolveScaledStyles(datum, args, usedScales, plot, 'fill')}
                            transform="translate({[minx + dx, y + inset + dy]})"
                            width={maxx - minx}
                            height={plot.scales.y.fn.bandwidth() - inset * 2}
                            rx={resolveProp(args.rx, datum, null)}
                            ry={resolveProp(args.ry, datum, null)}
                            use:addEventHandlers={{ scales: plot.scales, options: mark.options, datum }}
                        />
                    {/if}
                {/if}
            {/each}
        </g>
    {/snippet}
</Mark>
