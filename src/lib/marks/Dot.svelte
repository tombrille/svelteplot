<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext,
        PlotDefaults
    } from '../types.js';
    import { fade } from 'svelte/transition';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { maybeSymbol } from '$lib/helpers/symbols.js';
    import { symbol as d3Symbol } from 'd3-shape';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import { sort } from '$lib/index.js';
    import Mark from '../Mark.svelte';
    import DotCanvas from './helpers/DotCanvas.svelte';
    import { maybeData, testFilter, isValid } from '$lib/helpers/index.js';
    import { recordizeXY } from '$lib/transforms/recordize.js';
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
        canvas: boolean;
        dotClass: ConstantAccessor<string>;
        in: any;
        inParams: any;
        out: any;
        outParams: any;
        transition: any;
        wrap: Snippet;
    };

    let {
        data = [{}],
        canvas = false,
        class: className = '',
        dotClass = null,
        in: tIn = undefined,
        inParams = undefined,
        out: tOut = undefined,
        outParams = undefined,
        wrap = dotWrap,
        ...options
    }: DotProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    function getSymbolPath(symbolType, size) {
        return d3Symbol(maybeSymbol(symbolType), size)();
    }

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    const { dotRadius } = getContext<PlotDefaults>('svelteplot/_defaults');
    let testFacet = $derived(getTestFacet());

    let args = $derived(
        sort(
            recordizeXY({
                data: maybeData(data),
                // sort by descending radius by default
                ...(options.r ? { sort: { channel: '-r' } } : {}),
                ...options,
                ...(options.fill === true ? { fill: 'currentColor' } : {})
            })
        )
    );
</script>

{#snippet dotWrap(dot, args)}
    {@render dot(args)}
{/snippet}

{#snippet dot({ datum, args, usedScales, mark, plot })}
    {@const _x = resolveChannel('x', datum, args)}
    {@const _y = resolveChannel('y', datum, args)}
    {@const _r = resolveChannel('r', datum, { r: dotRadius, ...args })}
    {#if isValid(_x) && isValid(_y) && isValid(_r)}
        {@const [x, y] = projectXY(plot.scales, _x, _y, usedScales.x, usedScales.y)}
        {#if isValid(x) && isValid(y)}
            {@const dx = +resolveProp(args.dx, datum, 0)}
            {@const dy = +resolveProp(args.dy, datum, 0)}
            {@const r = usedScales.r ? +plot.scales.r.fn(_r) : +_r}
            {@const size = r * r * Math.PI}
            {@const symbol_ = resolveChannel('symbol', datum, {
                symbol: 'circle',
                ...args
            })}
            {@const symbol = usedScales.symbol ? plot.scales.symbol.fn(symbol_) : symbol_}
            <path
                class={dotClass ? resolveProp(dotClass, datum, null) : null}
                d={getSymbolPath(symbol, size)}
                transform="translate({x + dx}, {y + dy})"
                data-symbol={symbol}
                style={resolveScaledStyles(datum, args, usedScales, plot, 'stroke')}
                use:addEventHandlers={{
                    getPlotState,
                    options: mark.options,
                    datum
                }} />
        {/if}
    {/if}
{/snippet}

<Mark
    type="dot"
    required={['x', 'y']}
    channels={[
        'x',
        'y',
        'r',
        'symbol',
        'fill',
        'opacity',
        'stroke',
        'fillOpacity',
        'strokeOpacity'
    ]}
    {...args}>
    {#snippet children({ mark, usedScales })}
        <g class="dots {className || ''}">
            {#if canvas}
                <DotCanvas data={args.data} {mark} {plot} {testFacet} {usedScales} />
            {:else}
                {#each args.data as datum}
                    {#if testFilter(datum, mark.options) && testFacet(datum, mark.options)}
                        {@render wrap(dot, { mark, datum, args, usedScales, plot })}
                    {/if}
                {/each}
            {/if}
        </g>
    {/snippet}
</Mark>

<style>
    path {
        stroke-width: 1.6px;
    }
</style>
