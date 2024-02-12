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
        BaseMarkProps,
        RawValue,
        DataRecord,
        ConstantAccessor
    } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat.js';
    import dayjs from 'dayjs';
    import { max } from 'd3-array';
    import removeIdenticalLines from '$lib/helpers/removeIdenticalLines.js';
    import { derived } from 'svelte/store';
    import { fade } from 'svelte/transition';
    import numeral from 'numeral';
    import { maybeTimeInterval } from '$lib/helpers/time.js';
    import { autoTicks } from '$lib/helpers/autoTicks.js';

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
        } & BaseMarkProps
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let autoTickCount = $derived(
        Math.max(2, Math.round(plot.facetWidth / plot.options.x.tickSpacing))
    );

    let ticks: RawValue[] = $derived(
        data.length > 0
            ? // use custom tick values if user passed any as prop
              data
            : // use custom scale tick values if user passed any as plot scale option
              autoTicks(
                  plot.scales.x.type,
                  plot.options.x.ticks,
                  plot.options.x.interval,
                  plot.scales.x.domain,
                  plot.scales.x.fn,
                  autoTickCount
              )
    );

    let tickFmt = $derived(tickFormat || plot.options.x.tickFormat);

    let useTickFormat = $derived(
        typeof tickFmt === 'function'
            ? tickFmt
            : plot.scales.x.type === 'band' || plot.scales.x.type === 'point'
              ? (d) => d
              : plot.scales.x.type === 'time'
                ? typeof tickFmt === 'string' && tickFmt !== 'auto'
                    ? (d: Date) =>
                          dayjs(d)
                              .format(tickFmt as string)
                              .split('\n')
                    : autoTimeFormat(plot.scales.x, plot.plotWidth)
                : typeof tickFmt === 'string'
                  ? (d: number) =>
                        numeral(d).format(
                            tickFmt === 'auto'
                                ? `0.[00]${plot.options.x.percent ? '%' : 'a'}`
                                : tickFmt
                        )
                  : (d: RawValue) => String(plot.options.x.percent ? +(d * 100.0).toFixed(5) : d)
    );

    function splitTick(tick: string | string[]) {
        return Array.isArray(tick) ? tick : [tick];
    }

    let formattedTicks = $derived(
        removeIdenticalLines(
            ticks.map((tick) => ({
                value: tick,
                text: splitTick(useTickFormat(tick))
            }))
        )
    );

    let optionsLabel = $derived(plot.options?.x?.label);

    let isQuantitative = $derived(plot.scales.x.type !== 'point' && plot.scales.x.type !== 'band');

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

    const { getFacetState } = getContext('facet');
    let { lastX, lastY } = $derived(getFacetState());
</script>

<Mark
    type="axisX"
    data={data.length ? data.map((tick) => ({ __x: tick })) as DataRecord[] : []}
    channels={['x']}
    {...{ ...options, x: '__x' }}
    {automatic}
>
    {#if lastY}
        <g class="axis-x">
            {#if lastX && useTitle}
                <text
                    style={getBaseStyles(null, options)}
                    x={plot.plotWidth + plot.options.marginLeft}
                    y={anchor === 'top' ? 13 : plot.height - 13}
                    class="axis-title"
                    dominant-baseline={anchor === 'top' ? 'auto' : 'hanging'}>{useTitle}</text
                >
            {/if}
            {#each formattedTicks as tick, t}
                {@const x =
                    plot.scales.x.fn(tick.value) +
                    (plot.scales.x.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)}
                {@const nextX =
                    t < formattedTicks.length - 1
                        ? plot.scales.x.fn(formattedTicks[t + 1].value) +
                          (plot.scales.x.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)
                        : null}
                {@const tickLabelSpace = Math.abs(nextX - x)}
                {@const textLines = tick.text}
                {@const dx = resolveProp(options.dx, tick, 0)}
                {@const dy = resolveProp(options.dy, tick, 0)}
                {@const prevTextLines = t && formattedTicks[t - 1].text}
                {@const estLabelWidth =
                    max(textLines.map((t) => t.length)) * resolveProp(tickFontSize, tick) * 0.2}
                <g
                    class="tick"
                    data-tick={tick}
                    transform="translate({x + dx},{(anchor === 'bottom'
                        ? plot.options.marginTop + plot.facetHeight
                        : plot.options.marginTop) + dy})"
                >
                    {#if tickSize}
                        <line
                            style={getBaseStyles(tick, options)}
                            y2={anchor === 'bottom' ? tickSize : -tickSize}
                        />
                    {/if}
                    <text
                        style:font-variant={isQuantitative ? 'tabular-nums' : 'normal'}
                        style={getBaseStyles(tick, {
                            ...options,
                            fontSize: tickFontSize,
                            stroke: null
                        })}
                        y={(tickSize + tickPadding) * (anchor === 'bottom' ? 1 : -1)}
                        dominant-baseline={anchor === 'bottom' ? 'hanging' : 'auto'}
                    >
                        {#if data.length > 0 || t === 0 || t === ticks.length - 1 || tickLabelSpace >= estLabelWidth * 2}
                            {#if typeof textLines === 'string' || textLines.length === 1}
                                {textLines}
                            {:else}
                                {#each textLines as line, i}
                                    <tspan x="0" dy={i ? 12 : 0}
                                        >{!prevTextLines || prevTextLines[i] !== line
                                            ? line
                                            : ''}</tspan
                                    >
                                {/each}
                            {/if}
                        {/if}
                    </text>
                </g>
            {/each}
        </g>
    {/if}
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
