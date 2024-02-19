<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
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

<Mark type="tickX" channels={['x', 'y', 'stroke', 'opacity', 'strokeOpacity']} {...args} let:mark>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="tick-x">
        {#each args.data as datum}
            {@const x_ = resolveChannel('x', datum, args)}
            {@const y_ = resolveChannel('y', datum, args)}
            {#if isValid(x_) && (isValid(y_) || args.y == null) && (args.filter == null || resolveProp(args.filter, datum))}
                {@const x = useScale.x ? plot.scales.x.fn(x_) : x_}
                {@const y1 =
                    args.y != null
                        ? useScale.y
                            ? plot.scales.y.fn(y_)
                            : y_
                        : plot.options.marginTop}
                {@const y2 =
                    args.y != null
                        ? useScale.y
                            ? Number(plot.scales.y.fn(y_)) + plot.scales.y.fn.bandwidth()
                            : y_
                        : plot.options.marginTop + plot.plotHeight}
                <line
                    transform="translate({x}, {0})"
                    style={resolveScaledStyles(datum, args, useScale, plot, 'stroke')}
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
