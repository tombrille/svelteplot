<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext } from 'svelte';
    import Mark from '../Mark.svelte';
    import type { PlotContext, BaseMarkProps, RawValue, DataRecord } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveChannel, resolveProp } from '../helpers/resolve.js';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat.js';
    import dayjs from 'dayjs';
    import numeral from 'numeral';
    import type { ConstantAccessor } from '$lib/types.js';
    import { fade } from 'svelte/transition';
    import { autoTicks } from '$lib/helpers/autoTicks.js';

    let {
        data = [],
        automatic = false,
        title,
        anchor = 'left',
        lineAnchor = 'center',
        tickSize = 6,
        tickFontSize = 11,
        tickPadding = 3,
        tickFormat,
        ...options
    } = $props<
        {
            data?: RawValue[];
            automatic?: boolean;
            title?: string;
            anchor?: 'left' | 'right';
            lineAnchor?: 'top' | 'center' | 'bottom';
            tickFontSize?: ConstantAccessor<number>;
            tickSize?: number;
            tickPadding?: number;
            tickFormat?: string | ((d: RawValue) => string);
        } & BaseMarkProps
    >();

    const LINE_ANCHOR = {
        top: 'hanging',
        center: 'middle',
        bottom: 'auto'
    };

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let autoTickCount = $derived(
        Math.max(2, Math.round(plot.facetHeight / plot.options.y.tickSpacing))
    );

    let ticks: RawValue[] = $derived(
        data.length > 0
            ? // use custom tick values if user passed any as prop
              data
            : // use custom scale tick values if user passed any as plot scale option
              autoTicks(
                  plot.scales.y.type,
                  plot.options.y.ticks,
                  plot.options.y.interval,
                  plot.scales.y.domain,
                  plot.scales.y.fn,
                  autoTickCount
              )
    );

    let tickFmt = $derived(tickFormat || plot.options.y.tickFormat);

    let useTickFormat = $derived(
        typeof tickFmt === 'function'
            ? tickFmt
            : plot.scales.y.type === 'time'
              ? typeof tickFmt === 'string' && tickFmt !== 'auto'
                  ? (d: Date) =>
                        dayjs(d)
                            .format(tickFmt as string)
                            .split('\n')
                  : autoTimeFormat(plot.scales.y, plot.plotHeight)
              : typeof tickFmt === 'string'
                ? (d: number) => numeral(d).format(tickFmt === 'auto' ? '0.[00]a' : tickFmt)
                : (d: RawValue) => String(plot.options.y.percent ? +(d * 100.0).toFixed(5) : d)
    );

    let optionsLabel = $derived(plot.options.y.label);

    let useTitle = $derived(
        title ||
            (optionsLabel === null
                ? null
                : optionsLabel !== undefined
                  ? optionsLabel
                  : plot.scales.y.autoTitle
                    ? `↑ ${plot.scales.y.autoTitle}${plot.options.y.percent ? ' (%)' : ''}`
                    : '')
    );

    const { getFacetState } = getContext('facet');
    let { firstX, firstY } = $derived(getFacetState());
</script>

<Mark
    type="axisY"
    data={data.length ? data.map((tick) => ({ __y: tick })) as DataRecord[] : []}
    channels={['y']}
    {...{ ...options, y: '__y' }}
    {automatic}
>
    {#if firstX}
        <g class="axis-y">
            {#if firstY && useTitle}
                <text
                    style={getBaseStyles(null, options)}
                    style:text-anchor={anchor === 'left' ? 'start' : 'end'}
                    x={anchor === 'left' ? 0 : plot.width}
                    y={5}
                    class="axis-title"
                    dominant-baseline="hanging">{useTitle}</text
                >
            {/if}
            {#each ticks as tick, t}
                {@const tickText = useTickFormat(tick)}
                {@const       dx = resolveProp(options.dx, tick, 0) as number}
                {@const       dy = resolveProp(options.dy, tick, 0) as number}
                {@const y =
                    plot.scales.y.fn(tick) +
                    (plot.scales.y.type === 'band' ? plot.scales.y.fn.bandwidth() * 0.5 : 0)}
                <g
                    class="tick"
                    transform="translate({dx +
                        plot.options.marginLeft +
                        (anchor === 'left' ? 0 : plot.plotWidth)},{y + dy})"
                >
                    {#if tickSize}
                        <line
                            style={getBaseStyles(tick, options)}
                            x2={anchor === 'left' ? -tickSize : tickSize}
                        />
                    {/if}

                    <text
                        class:is-left={anchor === 'left'}
                        style={getBaseStyles(tick, { ...options, fontSize: tickFontSize })}
                        x={(tickSize + tickPadding) * (anchor === 'left' ? -1 : 1)}
                        dominant-baseline={LINE_ANCHOR[lineAnchor]}
                        >{Array.isArray(tickText) ? tickText.join(' ') : tickText}</text
                    >
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
        font-size: 11px;
        opacity: 0.8;
        fill: currentColor;
    }
    text.is-left {
        text-anchor: end;
    }
</style>
