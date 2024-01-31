<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        DataRow
    } from '$lib/types.js';
    export type DotMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: DataRow[];
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            r?: ChannelAccessor;
            rotate?: ChannelAccessor;
            symbol?: ChannelAccessor;
        };
</script>

<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveProp, resolveChannel } from '$lib/helpers/resolve.js';
    import { isSymbol, maybeSymbol } from '$lib/helpers/symbols.js';
    import { recordizeXY } from '$lib/transforms/recordize.js';
    import { symbol as d3Symbol } from 'd3-shape';
    import { Mark } from '$lib/classes/Mark.svelte.js';
    import { isEqual } from 'underscore';

    const BaseMark_Dot = BaseMark<BaseMarkProps & DotMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data: rawData, ...rawChannels } = $props<DotMarkProps>();

    let { data, ...channels } = $derived(recordizeXY({ data: rawData, ...rawChannels }));

    function isValid(value: RawValue): value is number | Date | string {
        return value !== null && !Number.isNaN(value);
    }

    function getSymbolPath(symbolT, size) {
        const symbolType = isSymbol(symbolT)
            ? maybeSymbol(symbolT)
            : maybeSymbol(plot.symbolScale(symbolT));
        return d3Symbol(symbolType, size)();
    }

    const mark = new Mark<DotMarkProps>('dot', ['x', 'y', 'r', 'symbol', 'fill', 'stroke'], false, {
        data,
        ...channels
    });

    plot.addMark(mark);

    $effect(() => {
        mark.update({ data, ...channels });
        return () => {
            plot.removeMark(mark);
        };
    });

    // $effect()

    // $inspect({channels})
</script>

<g class="dots">
    {#each data as datum, i}
        {@const cx = resolveChannel('x', datum, channels)}
        {@const cy = resolveChannel('y', datum, channels)}
        {@const maybeFillColor = resolveChannel('fill', datum, channels)}
        {@const maybeStrokeColor = resolveChannel('stroke', datum, channels)}
        {@const radius =
            typeof channels.r === 'number' || channels.r == null
                ? channels.r || 3
                : plot.radiusScale(resolveChannel('r', datum, channels))}
        {@const size = radius * radius * Math.PI}
        {@const symbolT = resolveChannel('symbol', datum, { symbol: 'circle', ...channels })}
        {@const symbolType = isSymbol(symbolT)
            ? maybeSymbol(symbolT)
            : maybeSymbol(plot.symbolScale(symbolT))}
        {#if isValid(cx) && isValid(cy)}
            <path
                d={getSymbolPath(symbolType, size)}
                style={getBaseStyles(datum, channels)}
                style:fill={maybeFillColor ? plot.colorScale(maybeFillColor) : null}
                style:stroke={maybeStrokeColor
                    ? plot.colorScale(maybeStrokeColor)
                    : maybeFillColor
                      ? null
                      : 'currentColor'}
                transform="translate({[plot.xScale(cx), plot.yScale(cy)]})"
            />
        {/if}
    {/each}
</g>

<style>
    path {
        fill: none;
        stroke: none;
        stroke-width: 1.6px;
    }
</style>
