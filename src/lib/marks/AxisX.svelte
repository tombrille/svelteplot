<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext } from 'svelte';
    import Mark from '../Mark.svelte';
    import BaseAxisX from './helpers/BaseAxisX.svelte';
    import type {
        PlotContext,
        BaseMarkProps,
        RawValue,
        DataRecord,
        ConstantAccessor
    } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat.js';
    import dayjs from 'dayjs';
    import { derived } from 'svelte/store';
    import numeral from 'numeral';
    import { autoTicks } from '$lib/helpers/autoTicks.js';

    let {
        data = [],
        automatic = false,
        title,
        anchor = 'bottom',
        facetAnchor = 'auto',
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
            facetAnchor?: 'auto' | 'top-empty' | 'bottom-empty' | 'top' | 'bottom';
            tickSize?: number;
            tickPadding?: number;
            tickFontSize?: ConstantAccessor<number>;
            tickFormat?: string | ((d: RawValue) => string);
        } & BaseMarkProps
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let autoTickCount = $derived(
        Math.max(3, Math.round(plot.facetWidth / plot.options.x.tickSpacing))
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

    let optionsLabel = $derived(plot.options?.x?.label);

    let scaleType = $derived(plot.scales.x.type);
    let isQuantitative = $derived(scaleType !== 'point' && scaleType !== 'band');

    let useTitle = $derived(
        title ||
            (optionsLabel === null
                ? null
                : optionsLabel !== undefined
                  ? optionsLabel
                  : plot.scales.x.autoTitle
                    ? isQuantitative
                        ? plot.options.x?.reverse
                            ? `← ${plot.scales.x.autoTitle}${plot.options.x.percent ? ' (%)' : ''}`
                            : `${plot.scales.x.autoTitle}${plot.options.x.percent ? ' (%)' : ''} →`
                        : plot.scales.x.autoTitle
                    : '')
    );

    let titleAlign = $derived(isQuantitative ? 'right' : 'center');

    const { getFacetState } = getContext('facet');
    let { left, top, bottom, bottomEmpty, topEmpty } = $derived(getFacetState());

    let useFacetAnchor = $derived(
        facetAnchor !== 'auto' ? facetAnchor : anchor === 'bottom' ? 'bottom-empty' : 'top-empty'
    );
    let showAxis = $state(false);
    $effect.pre(() => {
        showAxis =
            useFacetAnchor === 'top'
                ? top
                : useFacetAnchor === 'bottom'
                  ? bottom
                  : useFacetAnchor === 'top-empty'
                    ? topEmpty
                    : bottomEmpty;
    });
</script>

<Mark
    type="axisX"
    data={data.length ? data.map((tick) => ({ __x: tick })) : []}
    channels={['x']}
    {...{ ...options, x: '__x' }}
    {automatic}
>
    {#if left && top && useTitle}
        <text
            style={getBaseStyles(null, options)}
            style:text-anchor={titleAlign === 'right'
                ? 'end'
                : titleAlign === 'center'
                  ? 'center'
                  : 'start'}
            x={plot.options.marginLeft +
                plot.plotWidth * (titleAlign === 'right' ? 1 : titleAlign === 'center' ? 0.5 : 0)}
            y={anchor === 'top' ? 13 : plot.height - 13}
            class="x-axis-title"
            dominant-baseline={anchor === 'top' ? 'auto' : 'hanging'}>{useTitle}</text
        >
    {/if}
    {#if showAxis}
        <BaseAxisX
            scaleFn={plot.scales.x.fn}
            scaleType={plot.scales.x.type}
            tickFormat={useTickFormat}
            {ticks}
            marginTop={plot.options.marginTop}
            height={plot.facetHeight}
            {anchor}
            {tickSize}
            {tickPadding}
            {tickFontSize}
            {options}
            {plot}
        />
    {/if}
</Mark>

<style>
    text.x-axis-title {
        font-size: 11px;
        opacity: 0.8;
        fill: currentColor;
        text-anchor: end;
    }
</style>
