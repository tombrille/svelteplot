<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type {
        BaseMarkProps,
        GridXMarkProps,
        GridOptions,
        RawValue,
        AxisXMArkProps,
        AxisMarkOptions
    } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import getBaseStyles from '$lib/helpers/getBaseStyles';
    import removeIdenticalLines from '$lib/helpers/removeIdenticalLines';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat';
    import dayjs from 'dayjs';

    const BaseMark_AxisX = BaseMark<BaseMarkProps & AxisXMArkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        ticks = [],
        anchor = 'bottom',
        tickSize = 6,
        tickPadding = 3,
        tickFormat = null,
        automatic = false,
        y1 = null,
        y2 = null,
        title = null,
        tickFontSize = null,
        ...styleProps
    } = $props<AxisXMArkProps & AxisMarkOptions>();

    let autoTicks = $derived(
        ticks.length
            ? ticks
            : plot.options.x.ticks
              ? plot.options.x.ticks
              : plot.xScale.ticks(Math.ceil(plot.plotWidth / (plot.options.x.tickSpacing || 80)))
    );

    let useTickFormat = $derived(
        typeof tickFormat === 'function'
            ? tickFormat
            : plot.x.scaleType === 'time'
              ? typeof tickFormat === 'string'
                  ? (d: Date) =>
                        dayjs(d)
                            .format(tickFormat as string)
                            .split('\n')
                  : autoTimeFormat(plot.x, plot.plotWidth)
              : (d: RawValue) => String(d)
    );

    let tickTexts = $derived(
        removeIdenticalLines(
            autoTicks
                .map(useTickFormat)
                .map((tick: string | string[]) => (Array.isArray(tick) ? tick : [tick]))
        )
    );

    let autoTitle = $derived(
        plot.x.activeMarks.length === 1 && typeof plot.x.activeMarks[0].props.x === 'string'
            ? plot.x.activeMarks[0].props.x
            : null
    );
    let useTitle = $derived(title || autoTitle);
</script>

<BaseMark_AxisX type="axis-x" data={ticks} channels={['x']} {y1} {y2} {automatic}>
    <g class="axis-x">
        {#if useTitle}
            <text
                x={plot.plotWidth + plot.margins.left}
                y={plot.height - 10}
                class="Axis-title"
                dominant-baseline="hanging">{useTitle} →</text
            >
        {/if}
        {#each autoTicks as tick, t}
            {@const textLines = tickTexts[t]}
            {@const prevTextLines = t && tickTexts[t - 1]}
            <g
                class="x-tick"
                transform="translate({plot.xScale(tick)},{anchor === 'bottom'
                    ? plot.margins.top + plot.plotHeight
                    : plot.margins.top})"
            >
                <text
                    style={getBaseStyles(tick, { fontSize: tickFontSize })}
                    y={(tickSize + tickPadding) * (anchor === 'bottom' ? 1 : -1)}
                    dominant-baseline={anchor === 'bottom' ? 'hanging' : 'auto'}
                >
                    {#if typeof textLines === 'string' || textLines.length === 1}
                        {textLines}
                    {:else}
                        {#each textLines as line, i}
                            <tspan x="0" dy={i ? 12 : 0}
                                >{!prevTextLines || prevTextLines[i] !== line ? line : ''}</tspan
                            >
                        {/each}
                    {/if}
                </text>
                <line y2={anchor === 'bottom' ? tickSize : -tickSize} />
            </g>
        {/each}
    </g>
</BaseMark_AxisX>

<style>
    text {
        text-anchor: middle;
        font-size: 11px;

        fill: #4a4a4a;
    }

    text.grid-title {
        text-anchor: end;
    }
    .x-tick line {
        stroke: currentColor;
    }
    .x-tick line.grid {
        stroke: #d9d9d9;
    }
</style>
