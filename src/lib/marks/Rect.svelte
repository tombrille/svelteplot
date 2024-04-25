<!--
    @component
    For arbitrary rectangles, requires quantitative x and y scales 
-->
<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { recordizeY, intervalX, intervalY } from '$lib/index.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import { coalesce, testFilter, maybeNumber } from '../helpers/index.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        BaseRectMarkProps,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { addEventHandlers } from './helpers/events.js';

    type RectMarkProps = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        interval?: number | string;
    } & BaseRectMarkProps;

    let { data, ...options }: RectMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(
        intervalY(intervalX(recordizeY({ data, ...options }), { plot }), { plot }) as RectMarkProps
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="rect"
    required={[]}
    channels={[
        'x1',
        'x2',
        'y1',
        'y2',
        'fx',
        'fy',
        'fill',
        'stroke',
        'opacity',
        'fillOpacity',
        'strokeOpacity'
    ]}
    {...args}
>
    {#snippet children({ mark, usedScales })}
        <g class="rect" data-fill={usedScales.fillOpacity}>
            {#each args.data as datum}
                {#if testFilter(datum, args) && testFacet(datum, mark.options)}
                    {@const x1_ = resolveChannel('x1', datum, args)}
                    {@const x2_ = resolveChannel('x2', datum, args)}
                    {@const y1_ = resolveChannel('y1', datum, args)}
                    {@const y2_ = resolveChannel('y2', datum, args)}
                    {@const x1 =
                        x1_ == null
                            ? plot.options.marginLeft
                            : usedScales.x1
                            ? projectX('x', plot.scales, x1_)
                            : x1_}
                    {@const x2 =
                        x2_ == null
                            ? plot.options.marginLeft + plot.facetWidth
                            : usedScales.x2
                            ? projectX('x', plot.scales, x2_)
                            : x2_}
                    {@const y1 =
                        y1_ == null
                            ? plot.options.marginTop
                            : usedScales.y1
                            ? projectY('y', plot.scales, y1_)
                            : y1_}
                    {@const y2 =
                        y2_ == null
                            ? plot.options.marginTop + plot.facetHeight
                            : usedScales.y2
                            ? projectY('y', plot.scales, y2_)
                            : y2_}

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
                    {@const insetL = maybeNumber(coalesce(insetLeft, inset, 0))}
                    {@const insetT = maybeNumber(coalesce(insetTop, inset, 0))}
                    {@const insetR = maybeNumber(coalesce(insetRight, inset, 0))}
                    {@const insetB = maybeNumber(coalesce(insetBottom, inset, 0))}

                    {#if isValid(x1) && isValid(x2) && isValid(y1) && isValid(y2)}
                        <rect
                            style={resolveScaledStyles(datum, args, usedScales, plot, 'fill')}
                            transform="translate({[minx + insetL + dx, miny + insetT + dy]})"
                            width={maxx - minx - insetL - insetR}
                            height={maxy - miny - insetT - insetB}
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

<style>
    rect {
        stroke: none;
        /* fill: none; */
    }
</style>
