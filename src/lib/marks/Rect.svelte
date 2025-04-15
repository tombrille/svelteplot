<!--
    @component
    For arbitrary rectangles, requires quantitative x and y scales 
-->
<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { recordizeY, intervalX, intervalY } from '$lib/index.js';
    import {
        resolveChannel,
        resolveProp,
        resolveScaledStyles,
        resolveStyles
    } from '../helpers/resolve.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import { coalesce, testFilter, maybeNumber } from '../helpers/index.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        BaseRectMarkProps,
        ChannelAccessor
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { addEventHandlers } from './helpers/events.js';
    import GroupMultiple from './helpers/GroupMultiple.svelte';

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

    let { data = [{}], class: className = null, ...options }: RectMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    const args = $derived(
        intervalY(intervalX({ data, ...options }, { plot }), { plot }) as RectMarkProps
    );
</script>

<Mark
    type="rect"
    required={[]}
    channels={['x1', 'x2', 'y1', 'y2', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}>
    {#snippet children({ mark, usedScales, scaledData })}
        <g class="rect">
            {#each scaledData as d}
                {#if d.valid}
                    {@const x1 = d.x1 == null ? plot.options.marginLeft : d.x1}
                    {@const x2 = d.x2 == null ? plot.options.marginLeft + plot.facetWidth : d.x2}
                    {@const y1 = d.y1 == null ? plot.options.marginTop : d.y1}
                    {@const y2 = d.y2 == null ? plot.options.marginTop + plot.facetHeight : d.y2}

                    {@const miny = Math.min(y1, y2)}
                    {@const maxy = Math.max(y1, y2)}
                    {@const minx = Math.min(x1, x2)}
                    {@const maxx = Math.max(x1, x2)}
                    {@const inset = resolveProp(args.inset, d.datum, 0)}
                    {@const insetLeft = resolveProp(args.insetLeft, d.datum)}
                    {@const insetRight = resolveProp(args.insetRight, d.datum)}
                    {@const insetTop = resolveProp(args.insetTop, d.datum)}
                    {@const insetBottom = resolveProp(args.insetBottom, d.datum)}
                    {@const insetL = maybeNumber(coalesce(insetLeft, inset, 0))}
                    {@const insetT = maybeNumber(coalesce(insetTop, inset, 0))}
                    {@const insetR = maybeNumber(coalesce(insetRight, inset, 0))}
                    {@const insetB = maybeNumber(coalesce(insetBottom, inset, 0))}

                    {@const [style, styleClass] = resolveStyles(plot, d, args, 'fill', usedScales)}
                    <rect
                        class={[styleClass]}
                        {style}
                        x={minx + insetL}
                        y={miny + insetT}
                        width={maxx - minx - insetL - insetR}
                        height={maxy - miny - insetT - insetB}
                        rx={resolveProp(args.rx, d.datum, null)}
                        ry={resolveProp(args.ry, d.datum, null)}
                        use:addEventHandlers={{
                            getPlotState,
                            options: args,
                            datum: d.datum
                        }} />
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
