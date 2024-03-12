<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';
    import { sort } from '$lib/index.js';
    import { isValid, maybeData } from '$lib/helpers/index.js';

    let { data, ...options } = $props<
        BaseMarkProps & {
            data: DataRecord[];
            x: ChannelAccessor;
            y: ChannelAccessor;
            fill?: ChannelAccessor;
            stroke?: ChannelAccessor;
            children?: Snippet;
            dx?: ConstantAccessor<number>;
            dy?: ConstantAccessor<number>;
            text: ConstantAccessor<string>;
            title: ConstantAccessor<string>;
            /**
             * the line anchor for vertical position; top, bottom, or middle
             */
            lineAnchor?: ConstantAccessor<'bottom' | 'top' | 'middle'>;
        }
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    const LINE_ANCHOR = {
        bottom: 'auto',
        middle: 'central',
        top: 'hanging'
    };

    let args = $derived(sort({ data: maybeData(data), ...options }));

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="text"
    required={['x', 'y']}
    channels={[
        'x',
        'y',
        'r',
        'fx',
        'fy',
        'symbol',
        'fill',
        'stroke',
        'opacity',
        'strokeOpacity',
        'fillOpacity'
    ]}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}
    <g class="text" data-use-x={useScale.x ? 1 : 0}>
        {#each args.data as datum}
            {#if testFacet(datum, mark.options) && (args.filter == null || resolveProp(args.filter, datum))}
                {@const _x = resolveChannel('x', datum, args)}
                {@const _y = resolveChannel('y', datum, args)}
                {@const title = resolveProp(args.title, datum, '')}
                {#if isValid(_x) && isValid(_y)}
                    {@const [x, y] = projectXY(plot.scales, _x, _y, useScale.x, useScale.y)}
                    {#if isValid(x) && isValid(y)}
                        {@const dx = +resolveProp(args.dx, datum, 0)}
                        {@const dy = +resolveProp(args.dy, datum, 0)}
                        {@const textLines = String(resolveProp(args.text, datum, '')).split('\n')}
                        {#if textLines.length > 1}
                            <text
                                dominant-baseline={LINE_ANCHOR[
                                    resolveProp(args.lineAnchor, datum, 'middle') || 'middle'
                                ]}
                                transform="translate({[x + dx, y + dy]})"
                                >{#each textLines as line, l}<tspan
                                        x="0"
                                        dy={l ? resolveProp(args.fontSize, datum) || 12 : 0}
                                        style={resolveScaledStyles(
                                            { ...datum, __tspanIndex: l },
                                            args,
                                            useScale,
                                            plot,
                                            'fill'
                                        )}>{line}</tspan
                                    >{/each}{#if title}<title>{title}</title>{/if}</text
                            >
                        {:else}
                            <text
                                dominant-baseline={LINE_ANCHOR[
                                    resolveProp(args.lineAnchor, datum, 'middle') || 'middle'
                                ]}
                                transform="translate({[x + dx, y + dy]})"
                                style={resolveScaledStyles(
                                    { ...datum, __tspanIndex: 0 },
                                    args,
                                    useScale,
                                    plot,
                                    'fill'
                                )}
                                >{textLines[0]}{#if title}<title>{title}</title>{/if}</text
                            >
                        {/if}
                    {/if}
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    text {
        text-anchor: middle;
        fill: none;
        stroke: none;
        font-size: 12px;
        font-weight: 500;
        stroke-width: 1.6px;
        paint-order: stroke fill;
    }
</style>
