<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import GroupMultiple from './helpers/GroupMultiple.svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { facetWrap } from '$lib/transforms/facet.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { projectX, projectXY } from '../helpers/scales.js';
    import Mark from '../Mark.svelte';
    import { sort } from '$lib/index.js';
    import { isValid } from '$lib/helpers/index.js';

    type TextMarkProps = BaseMarkProps & {
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
         * if you want to apply class names to individual text elements
         */
        textClass: ConstantAccessor<string>;
        /**
         * the line anchor for vertical position; top, bottom, or middle
         */
        lineAnchor?: ConstantAccessor<'bottom' | 'top' | 'middle'>;
        frameAnchor?: ConstantAccessor<
            | 'bottom'
            | 'top'
            | 'left'
            | 'right'
            | 'top-left'
            | 'bottom-left'
            | 'top-right'
            | 'bottom-right'
        >;
    };

    let { data = [{}], class: className = null, ...options }: TextMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    const LINE_ANCHOR = {
        bottom: 'auto',
        middle: 'central',
        top: 'hanging'
    };

    let args = $derived(
        facetWrap(
            sort({
                data,
                ...options
            })
        )
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="text"
    channels={[
        'x',
        'y',
        'r',
        'fx',
        'fy',
        'fz',
        'symbol',
        'fill',
        'stroke',
        'opacity',
        'strokeOpacity',
        'fillOpacity'
    ]}
    {...args}>
    {#snippet children({ mark, usedScales })}
        <GroupMultiple class="text {className || null}" length={className ? 2 : args.data.length}>
            {#each args.data as datum}
                {#if testFacet(datum, mark.options) && (args.filter == null || resolveProp(args.filter, datum))}
                    {@const _x = resolveChannel('x', datum, args)}
                    {@const _y = resolveChannel('y', datum, args)}
                    {@const title = resolveProp(args.title, datum, '')}
                    {@const frameAnchor = resolveProp(args.frameAnchor, datum)}
                    {#if (args.x == null || isValid(_x)) && (args.y == null || isValid(_y))}
                        {@const isLeft =
                            frameAnchor === 'left' ||
                            frameAnchor === 'top-left' ||
                            frameAnchor === 'bottom-left'}
                        {@const isRight =
                            frameAnchor === 'right' ||
                            frameAnchor === 'top-right' ||
                            frameAnchor === 'bottom-right'}
                        {@const isTop =
                            frameAnchor === 'top' ||
                            frameAnchor === 'top-left' ||
                            frameAnchor === 'top-right'}
                        {@const isBottom =
                            frameAnchor === 'bottom' ||
                            frameAnchor === 'bottom-left' ||
                            frameAnchor === 'bottom-right'}
                        {@const [x, y] =
                            args.x != null && args.y != null
                                ? projectXY(plot.scales, _x, _y, usedScales.x, usedScales.y)
                                : [
                                      args.x != null
                                          ? projectX('x', plot.scales, _x)
                                          : isLeft
                                            ? 0
                                            : isRight
                                              ? plot.facetWidth
                                              : plot.facetWidth * 0.5,
                                      args.y != null
                                          ? projectX('y', plot.scales, _y)
                                          : isTop
                                            ? 0
                                            : isBottom
                                              ? plot.facetHeight
                                              : plot.facetHeight * 0.5
                                  ]}
                        {#if isValid(x) && isValid(y)}
                            {@const dx = +resolveProp(args.dx, datum, 0)}
                            {@const dy = +resolveProp(args.dy, datum, 0)}
                            {@const textLines = String(resolveProp(args.text, datum, '')).split(
                                '\n'
                            )}
                            {@const lineAnchor = resolveProp(
                                args.lineAnchor,
                                datum,
                                args.y != null
                                    ? 'middle'
                                    : isTop
                                      ? 'top'
                                      : isBottom
                                        ? 'bottom'
                                        : 'middle'
                            )}
                            {@const textClassName = resolveProp(args.textClass, datum, null)}

                            {#if textLines.length > 1}
                                {@const fontSize = resolveProp(args.fontSize, datum) || 12}
                                <text
                                    class={textClassName}
                                    dominant-baseline={LINE_ANCHOR[lineAnchor]}
                                    transform="translate({[
                                        Math.round(x + dx),
                                        Math.round(
                                            y +
                                                dy -
                                                (lineAnchor === 'bottom'
                                                    ? textLines.length - 1
                                                    : lineAnchor === 'middle'
                                                      ? (textLines.length - 1) * 0.5
                                                      : 0) *
                                                    fontSize
                                        )
                                    ]})"
                                    >{#each textLines as line, l}<tspan
                                            x="0"
                                            dy={l ? fontSize : 0}
                                            style={resolveScaledStyles(
                                                { ...datum, __tspanIndex: l },
                                                {
                                                    textAnchor: isLeft
                                                        ? 'start'
                                                        : isRight
                                                          ? 'end'
                                                          : 'middle',
                                                    ...args
                                                },
                                                usedScales,
                                                plot,
                                                'fill'
                                            )}>{line}</tspan
                                        >{/each}{#if title}<title>{title}</title>{/if}</text>
                            {:else}
                                <text
                                    class={textClassName}
                                    dominant-baseline={LINE_ANCHOR[lineAnchor]}
                                    transform="translate({[
                                        Math.round(x + dx),
                                        Math.round(y + dy)
                                    ]})"
                                    style={resolveScaledStyles(
                                        { ...datum, __tspanIndex: 0 },
                                        {
                                            textAnchor: isLeft
                                                ? 'start'
                                                : isRight
                                                  ? 'end'
                                                  : 'middle',
                                            ...args
                                        },
                                        usedScales,
                                        plot,
                                        'fill'
                                    )}
                                    >{textLines[0]}{#if title}<title>{title}</title>{/if}</text>
                            {/if}
                        {/if}
                    {/if}
                {/if}
            {/each}
        </GroupMultiple>
    {/snippet}
</Mark>

<style>
    text {
        fill: none;
        stroke: none;
        font-size: 12px;
        font-weight: 500;
        stroke-width: 1.6px;
        paint-order: stroke fill;
    }
</style>
