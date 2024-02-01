<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext } from 'svelte';
    import Mark from '../Mark.svelte';
    import type {
        PlotContext,
        BaseMarkStyleProps,
        RawValue,
        DataRecord,
        ConstantAccessor
    } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat.js';
    import dayjs from 'dayjs';
    import { max } from 'd3-array';
    import { format } from 'd3-format';
    import removeIdenticalLines from '$lib/helpers/removeIdenticalLines.js';

    let {
        data = [],
        automatic = false,
        title,
        anchor = 'bottom',
        tickSize = 6,
        tickPadding = 3,
        tickFontSize = 11,
        tickFormat,
        ...options
    } = $props<
        {
            data?: RawValue[];
            automatic?: boolean;
            title?: string;
            anchor?: 'top' | 'bottom';
            tickSize?: number;
            tickPadding?: number;
            tickFontSize?: ConstantAccessor<number>;
            tickFormat?: string | ((d: RawValue) => string);
        } & BaseMarkStyleProps
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let autoTickCount = $derived(
        Math.max(2, Math.round(plot.plotWidth / plot.options.x.tickSpacing))
    );

    let ticks: RawValue[] = $derived(
        data.length > 0
            ? // use custom tick values if user passed any as prop
              data
            : // use custom scale tick values if user passed any as plot scale option
              plot.options.x.ticks ||
                  // fall back to auto-generated ticks
                  plot.scales.x.fn.ticks(autoTickCount)
    );

    let tickFmt = $derived(tickFormat || plot.options.x.tickFormat);

    let useTickFormat = $derived(
        typeof tickFmt === 'function'
            ? tickFmt
            : plot.scales.x.type === 'time'
              ? typeof tickFmt === 'string'
                  ? (d: Date) =>
                        dayjs(d)
                            .format(tickFmt as string)
                            .split('\n')
                  : autoTimeFormat(plot.scales.x, plot.plotWidth)
              : typeof tickFmt === 'string' 
                ? format(tickFmt) 
              : (d: RawValue) => String(plot.options.x.percent ? +(d * 100.0).toFixed(5) : d)
    );

    let tickTexts = $derived(
        removeIdenticalLines(
            ticks
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
                  : plot.scales.x.autoTitle
                    ? plot.options.x?.reverse
                        ? `← ${plot.scales.x.autoTitle}${plot.options.x.percent ? ' (%)' : ''}`
                        : `${plot.scales.x.autoTitle}${plot.options.x.percent ? ' (%)' : ''} →`
                    : '')
    );
</script>

<Mark
    type="axisX"
    data={data.length ? data.map((tick) => ({ __x: tick })) as DataRecord[] : []}
    channels={['x']}
    {...{ ...options, x: '__x' }}
    {automatic}
>
    <g class="axis-x">
        {#if useTitle}
            <text
                style={getBaseStyles(null, options)}
                x={plot.plotWidth + plot.options.marginLeft}
                y={anchor === 'top' ? 13 : plot.height - 13}
                class="axis-title"
                dominant-baseline={anchor === 'top' ? 'auto' : 'hanging'}>{useTitle}</text
            >
        {/if}
        {#each ticks as tick, t}
            {@const x =
                plot.scales.x.fn(tick) +
                (plot.scales.x.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)}
            {@const nextX = t < ticks.length-1 ? (plot.scales.x.fn(ticks[t+1]) +
                (plot.scales.x.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)) : null}
            {@const tickLabelSpace = Math.abs(nextX - x)}
            {@const textLines = tickTexts[t]}
            {@const prevTextLines = t && tickTexts[t - 1]}
            {@const estLabelWidth = max(textLines.map(t => t.length)) * resolveProp(tickFontSize, tick) * 0.6}
            <g
                class="tick"
                data-tick-space={tickLabelSpace}
                data-tick-width={estLabelWidth}
                transform="translate({x},{anchor === 'bottom'
                    ? plot.options.marginTop + plot.plotHeight
                    : plot.options.marginTop})"
            >
                {#if tickSize}
                    <line
                        style={getBaseStyles(tick, options)}
                        y2={anchor === 'bottom' ? tickSize : -tickSize}
                    />
                {/if}
                <text
                    style={getBaseStyles(tick, { ...options, fontSize: tickFontSize })}
                    y={(tickSize + tickPadding) * (anchor === 'bottom' ? 1 : -1)}
                    dominant-baseline={anchor === 'bottom' ? 'hanging' : 'auto'}
                >
                    {#if data.length > 0 || t === 0 || t === ticks.length-1 || tickLabelSpace >= estLabelWidth * 2}
                        {#if typeof textLines === 'string' || textLines.length === 1}
                            {textLines}
                        {:else}
                            {#each textLines as line, i}
                                <tspan x="0" dy={i ? 12 : 0}
                                    >{!prevTextLines || prevTextLines[i] !== line ? line : ''}</tspan
                                >
                            {/each}
                        {/if}
                    {/if}
                </text>
            </g>
        {/each}
    </g>
</Mark>

<style>
    line {
        stroke: currentColor;
    }
    text {
        text-anchor: middle;
        font-size: 11px;
        opacity: 0.8;
        fill: currentColor;
    }
    text.axis-title {
        text-anchor: end;
    }
</style>
