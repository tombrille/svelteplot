<script lang="ts">
    // external
    import { getContext } from 'svelte';
    import dayjs from 'dayjs';
    // types
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, RawValue, AxisXMarkProps, AxisMarkOptions } from '$lib/types.js';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import removeIdenticalLines from '$lib/helpers/removeIdenticalLines.js';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat.js';

    const BaseMark_AxisX = BaseMark<BaseMarkProps & AxisXMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        ticks = [],
        anchor = 'bottom',
        tickSize = 6,
        tickPadding = 3,
        tickFormat = null,
        automatic = false,
        title = null,
        tickFontSize = null,
        fill = null,
        ...styleProps
    } = $props<AxisXMarkProps & AxisMarkOptions>();

    let autoTickCount = $derived(
        Math.max(2, Math.round(plot.plotWidth / (plot.options?.x?.tickSpacing || 80)))
    );

    $inspect(autoTickCount);

    let autoTicks = $derived(
        ticks.length > 0 ? ticks : plot.options?.x?.ticks ?? plot.xScale.ticks(autoTickCount)
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

    let optionsLabel = $derived(plot.options?.x?.label);

    let useTitle = $derived(
        title ||
            (optionsLabel === null
                ? null
                : optionsLabel !== undefined
                  ? optionsLabel
                  : plot.x.autoTitle
                    ? plot.options.x?.reverse
                        ? `← ${plot.x.autoTitle}`
                        : `${plot.x.autoTitle} →`
                    : '')
    );
</script>

<BaseMark_AxisX type="axis-x" data={ticks} channels={['x']} {automatic}>
    <g class="axis-x">
        {#if useTitle}
            <text
                x={plot.plotWidth + plot.margins.left}
                y={plot.height - 10}
                class="axis-title"
                dominant-baseline="hanging">{useTitle}</text
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
                    style={getBaseStyles(tick, { fill, fontSize: tickFontSize })}
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
                <line
                    style={getBaseStyles(tick, styleProps)}
                    y2={anchor === 'bottom' ? tickSize : -tickSize}
                />
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

    text.axis-title {
        text-anchor: end;
    }
    .x-tick line {
        stroke: currentColor;
    }
    .x-tick line.grid {
        stroke: #d9d9d9;
    }
</style>
