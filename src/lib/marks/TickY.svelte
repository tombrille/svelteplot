<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import type {
        PlotContext,
        BaseMarkProps,
        ChannelAccessor,
        DataRow,
        FacetContext
    } from '../types.js';
    import { recordizeY } from '$lib/index.js';
    import { getUsedScales } from '../helpers/scales.js';
    import { isValid } from '../helpers/isValid.js';
    import { testFilter } from '$lib/helpers/index.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let { data = [], ...options } = $props<
        BaseMarkProps & {
            data: DataRow[];
            /**
             * the vertical position; bound to the x scale
             */
            y?: ChannelAccessor;
            /**
             * the horizontal position; bound to the x scale, which must be band. If the x channel
             * is not specified, the tick will span the full horizontal extent of the frame.
             */
            x?: ChannelAccessor;
            stroke?: ChannelAccessor;
        }
    >();

    let args = $derived(recordizeY({ data, ...options }, { withIndex: false }));

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="tickY"
    channels={['x', 'y', 'fx', 'fy', 'stroke', 'opacity', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="tick-y">
        {#each args.data as datum}
            {#if testFacet(datum, mark.options) && testFilter(datum, args)}
                {@const y_ = resolveChannel('y', datum, args)}
                {@const x_ = resolveChannel('x', datum, args)}
                {#if isValid(y_) && (isValid(x_) || args.x == null)}
                    {@const y = useScale.y ? plot.scales.y.fn(y_) : y_}
                    {@const x1 =
                        args.x != null
                            ? useScale.x
                                ? plot.scales.x.fn(x_)
                                : x_
                            : plot.options.marginLeft}
                    {@const x2 =
                        args.x != null
                            ? useScale.x
                                ? Number(plot.scales.x.fn(x_)) + plot.scales.x.fn.bandwidth()
                                : y_
                            : plot.options.marginLeft + plot.facetWidth}
                    <line
                        transform="translate({0}, {y})"
                        style={resolveScaledStyles(datum, args, useScale, plot, 'stroke')}
                        {x1}
                        {x2}
                    />
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    .tick-y line {
        stroke: currentColor;
    }
</style>
