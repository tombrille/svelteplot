<!--
    @component
    For arbitrary rectangles, requires band x and y scales 
-->
<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { recordizeY, sort } from '$lib/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import { coalesce, testFilter } from '../helpers/index.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        RectMarkProps,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { addEvents } from './helpers/events.js';

    type Props = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    } & RectMarkProps;

    let { data, ...options } = $props<Props>();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(
        options.sort !== undefined
            ? // user has defined a custom sorting
              sort(recordizeY({ data, ...options }))
            : // sort by x and y
              (sort({
                  ...sort({
                      ...recordizeY({ data, ...options }),
                      sort: { channel: 'x' }
                  }),
                  sort: { channel: 'y' }
              }) as Props)
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="cell"
    required={['x', 'y']}
    channels={['x', 'y', 'fx', 'fy', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g class="rect" data-fill={useScale.fillOpacity}>
        {#each args.data as datum}
            {#if testFilter(datum, args) && testFacet(datum, mark.options)}
                {@const x_ = resolveChannel('x', datum, args)}
                {@const y_ = resolveChannel('y', datum, args)}
                {@const x1 = useScale.x ? projectX('x1', plot.scales, x_) : x_}
                {@const x2 = x1 + plot.scales.x.fn.bandwidth()}
                {@const y1 = useScale.y ? projectY('y1', plot.scales, y_) : y_}
                {@const y2 = y1 + plot.scales.y.fn.bandwidth()}
                {@const miny = Math.min(y1, y2)}
                {@const maxy = Math.max(y1, y2)}
                {@const minx = Math.min(x1, x2)}
                {@const maxx = Math.max(x1, x2)}
                {@const inset = resolveProp(args.inset, datum, 0)}
                {@const insetLeft = resolveProp(args.insetLeft, datum)}
                {@const insetRight = resolveProp(args.insetRight, datum)}
                {@const insetTop = resolveProp(args.insetTop, datum)}
                {@const insetBottom = resolveProp(args.insetBottom, datum)}
                {@const dx = resolveProp(args.dx, datum, 0)}
                {@const dy = resolveProp(args.dy, datum, 0)}
                {@const insetL = coalesce(insetLeft, inset) || 0}
                {@const insetT = coalesce(insetTop, inset) || 0}
                {@const insetR = coalesce(insetRight, inset) || 0}
                {@const insetB = coalesce(insetBottom, inset) || 0}

                {#if isValid(x1) && isValid(x2) && isValid(y1) && isValid(y2) && (args.fill == null || isValid(resolveChannel('fill', datum, args)))}
                    <rect
                        style={resolveScaledStyles(datum, args, useScale, plot, 'fill')}
                        transform="translate({[minx + insetL + dx, miny + insetT + dy]})"
                        width={maxx - minx - insetL - insetR}
                        height={maxy - miny - insetT - insetB}
                        rx={resolveProp(args.rx, datum, null)}
                        ry={resolveProp(args.ry, datum, null)}
                        use:addEvents={{ options: mark.options, datum }}
                    />
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    rect {
        stroke: none;
        /* fill: none; */
    }
</style>
