<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import type {
        CurveName,
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        DataRow
    } from '../types.js';
    import { recordizeX } from '$lib/index.js';
    import { getUsedScales } from '../helpers/scales.js';
    import { isValid } from '../helpers/isValid.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let {
        data = [],
        filter,
        ...options
    } = $props<
        BaseMarkProps & {
            data: DataRow[];
            /**
             * the horizontal position; bound to the x scale
             */
            x?: ChannelAccessor;
            /**
             * the vertical position; bound to the y scale, which must be band. If the y channel
             * is not specified, the tick will span the full vertical extent of the frame.
             */
            y?: ChannelAccessor;
            stroke?: ChannelAccessor;
        }
    >();

    let args = $derived(recordizeX({ data, ...options }, { withIndex: false }));
</script>

<Mark type="tickX" channels={['x', 'y', 'stroke']} {...args} let:mark>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="tick-x">
        {#each args.data as datum}
            {@const x_ = resolveChannel('x', datum, args)}
            {@const y_ = resolveChannel('y', datum, args)}
            {#if isValid(x_) && (isValid(y_) || args.y == null) && (args.filter == null || resolveProp(args.filter, datum))}
                {@const x = useScale.x ? plot.scales.x.fn(x_) : x_}
                {@const       y1 = (args.y != null ? 
                    (useScale.y ? plot.scales.y.fn(y_) : y_) : plot.options.marginTop) as number}
                {@const       y2 = (args.y != null ? (useScale.y ? Number(plot.scales.y.fn(y_)) + plot.scales.y.fn.bandwidth() : y_) : plot.options.marginTop + plot.plotHeight) as number}
                {@const       stroke_ = resolveChannel('stroke', datum, args) as string}
                <line
                    transform="translate({x}, {0})"
                    style={getBaseStyles(datum, args)}
                    stroke={stroke_
                        ? (useScale.stroke
                            ? plot.scales.color.fn(stroke_)
                            : stroke_) as string
                        : 'currentColor'}
                    {y1}
                    {y2}
                />
            {/if}
        {/each}
    </g>
</Mark>

<style>
    .tick-x line {
        stroke: currentColor;
    }
</style>
