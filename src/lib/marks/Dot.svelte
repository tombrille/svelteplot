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
    import { maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import { sort } from '$lib/index.js';
    import Mark from '../Mark.svelte';
    import DotCanvas from './helpers/DotCanvas.svelte';
    import { maybeData, testFilter, isValid } from '$lib/helpers/index.js';
    import { addEventHandlers } from './helpers/events.js';

    type DotProps = BaseMarkProps & {
        data: DataRecord[];
        x: ChannelAccessor;
        y: ChannelAccessor;
        r?: ChannelAccessor;
        fill?: ChannelAccessor;
        stroke?: ChannelAccessor;
        symbol?: ChannelAccessor | Snippet<[number, string]>;
        children?: Snippet;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
        canvas?: boolean;
    };

    let { data, canvas, ...options }: DotProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    function getSymbolPath(symbolType, size) {
        return d3Symbol(maybeSymbol(symbolType), size)();
    }

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());

    let args = $derived(
        sort({
            data: maybeData(data),
            // sort by descending radius by default
            ...(options.r ? { sort: { channel: '-r' } } : {}),
            ...options,
            ...(options.fill === true ? { fill: 'currentColor' } : {})
        })
    );
</script>

<Mark
    type="dot"
    required={['x', 'y']}
    channels={[
        'x',
        'y',
        'fx',
        'fy',
        'r',
        'symbol',
        'fill',
        'opacity',
        'stroke',
        'fillOpacity',
        'strokeOpacity'
    ]}
    {...args}
    let:mark
>
    {@const useScale = getUsedScales(plot, args, mark)}

    <g class="dots">
        {#if canvas}
            <DotCanvas {data} {mark} {plot} {testFacet} {useScale} />
        {:else}
            {#each args.data as datum}
                {#if testFilter(datum, mark.options) && testFacet(datum, mark.options)}
                    {@const _x = resolveChannel('x', datum, args)}
                    {@const _y = resolveChannel('y', datum, args)}
                    {@const _r = resolveChannel('r', datum, { r: 3, ...args })}
                    {#if isValid(_x) && isValid(_y) && isValid(_r)}
                        {@const [x, y] = projectXY(plot.scales, _x, _y, useScale.x, useScale.y)}
                        {#if isValid(x) && isValid(y)}
                            {@const dx = +resolveProp(args.dx, datum, 0)}
                            {@const dy = +resolveProp(args.dx, datum, 0)}
                            {@const r = useScale.r ? +plot.scales.r.fn(_r) : +_r}
                            {@const size = r * r * Math.PI}
                            {@const symbol_ = resolveChannel('symbol', datum, {
                                symbol: 'circle',
                                ...args
                            })}
                            {@const symbol = useScale.symbol
                                ? plot.scales.symbol.fn(symbol_)
                                : symbol_}
                            <path
                                d={getSymbolPath(symbol, size)}
                                transform="translate({x + dx}, {y + dy})"
                                data-symbol={symbol}
                                style={resolveScaledStyles(datum, args, useScale, plot, 'stroke')}
                                use:addEventHandlers={{
                                    scales: plot.scales,
                                    options: mark.options,
                                    datum
                                }}
                            />
                        {/if}
                    {/if}
                {/if}
            {/each}
        {/if}
    </g>
</Mark>

<style>
    path {
        stroke-width: 1.6px;
    }
</style>
