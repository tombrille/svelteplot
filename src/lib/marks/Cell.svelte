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

    type CellProps = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    } & BaseRectMarkProps;

    let { data, ...options }: CellProps = $props();

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
    channels={[
        'x',
        'y',
        'fx',
        'fy',
        'fz',
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
                    {@const x_ = resolveChannel('x', datum, args)}
                    {@const y_ = resolveChannel('y', datum, args)}
                    {@const x1 = usedScales.x ? projectX('x1', plot.scales, x_) : x_}
                    {@const x2 = x1 + plot.scales.x.fn.bandwidth()}
                    {@const y1 = usedScales.y ? projectY('y1', plot.scales, y_) : y_}
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
                    {@const insetL = maybeNumber(coalesce(insetLeft, inset, 0))}
                    {@const insetT = maybeNumber(coalesce(insetTop, inset, 0))}
                    {@const insetR = maybeNumber(coalesce(insetRight, inset, 0))}
                    {@const insetB = maybeNumber(coalesce(insetBottom, inset, 0))}

                    {#if isValid(x1) && isValid(x2) && isValid(y1) && isValid(y2) && (args.fill == null || isValid(resolveChannel('fill', datum, args)))}
                        <rect
                            style={resolveScaledStyles(datum, args, usedScales, plot, 'fill')}
                            transform="translate({[minx + insetL + dx, miny + insetT + dy]})"
                            width={maxx - minx - insetL - insetR}
                            height={maxy - miny - insetT - insetB}
                            rx={resolveProp(args.rx, datum, null)}
                            ry={resolveProp(args.ry, datum, null)}
                            use:addEventHandlers={{
                                scales: plot.scales,
                                options: mark.options,
                                datum
                            }}
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
