<script lang="ts">
    import { getContext } from 'svelte';
    import BaseAxisY from './helpers/BaseAxisY.svelte';
    import Mark from '../Mark.svelte';
    import type {
        PlotContext,
        BaseMarkProps,
        RawValue,
        DataRecord,
        FacetContext,
        DefaultOptions
    } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat.js';
    import dayjs from 'dayjs';
    import numeral from 'numeral';
    import type { ConstantAccessor } from '$lib/types.js';
    import { autoTicks } from '$lib/helpers/autoTicks.js';
    import { resolveScaledStyles } from '$lib/helpers/resolve.js';

    const DEFAULTS = {
        tickSize: 6,
        tickPadding: 3,
        tickFontSize: 11,
        axisYAnchor: 'left',
        ...getContext<Partial<DefaultOptions>>('svelteplot/defaults')
    };

    type AxisYProps = BaseMarkProps & {
        data?: RawValue[];
        automatic?: boolean;
        title?: string;
        anchor?: 'left' | 'right';
        facetAnchor?: 'auto' | 'left' | 'right' | 'left-empty' | 'right-empty';
        lineAnchor?: 'top' | 'center' | 'bottom';
        tickSize?: number;
        tickFontSize?: ConstantAccessor<number>;
        tickPadding?: number;
        tickFormat?: string | ((d: RawValue) => string);
    };

    let {
        data = [],
        automatic = false,
        title,
        anchor = DEFAULTS.axisYAnchor,
        facetAnchor = 'auto',
        lineAnchor = 'center',
        tickSize = DEFAULTS.tickSize,
        tickFontSize = DEFAULTS.tickFontSize,
        tickPadding = DEFAULTS.tickPadding,
        tickFormat,
        ...options
    }: AxisYProps = $props();

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
            : plot.scales.y.type === 'band' || plot.scales.y.type === 'point'
              ? (d) => d
              : plot.scales.y.type === 'time'
                ? typeof tickFmt === 'string' && tickFmt !== 'auto'
                    ? (d: Date) =>
                          dayjs(d)
                              .format(tickFmt as string)
                              .split('\n')
                    : autoTimeFormat(plot.scales.y, plot.plotHeight)
                : typeof tickFmt === 'string'
                  ? (d: number) =>
                        numeral(plot.options.y.percent ? d * 100 : d).format(
                            tickFmt === 'auto' ? '0.[00]a' : tickFmt
                        )
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

    const { getFacetState } = getContext<FacetContext>('svelteplot/facet');
    let { left, leftEmpty, right, rightEmpty, top } = $derived(getFacetState());

    let useFacetAnchor = $derived(
        facetAnchor !== 'auto' ? facetAnchor : anchor === 'left' ? 'left-empty' : 'right-empty'
    );

    let showAxis = $state(false);
    $effect.pre(() => {
        showAxis =
            useFacetAnchor === 'left'
                ? left
                : useFacetAnchor === 'right'
                  ? right
                  : useFacetAnchor === 'left-empty'
                    ? leftEmpty
                    : rightEmpty;
    });
</script>

<Mark
    type="axisY"
    data={data.length ? data.map((tick) => ({ __y: tick })) : []}
    channels={['y']}
    {...{ ...options, y: '__y' }}
    {automatic}
>
    {#if left && top && useTitle}
        <text
            style={resolveScaledStyles(
                null,
                { ...options, stroke: null, textAnchor: anchor === 'left' ? 'start' : 'end' },
                {},
                plot,
                'fill'
            )}
            x={anchor === 'left' ? 0 : plot.width}
            y={5}
            class="axis-x-title"
            dominant-baseline="hanging">{useTitle}</text
        >
    {/if}
    {#if showAxis}
        <BaseAxisY
            scaleFn={plot.scales.y.fn}
            scaleType={plot.scales.y.type}
            tickFormat={useTickFormat}
            {ticks}
            marginLeft={plot.options.marginLeft}
            width={plot.facetWidth}
            {anchor}
            {lineAnchor}
            {tickSize}
            {tickPadding}
            {tickFontSize}
            {options}
            {plot}
        />
    {/if}
</Mark>

<style>
    text {
        font-size: 11px;
        opacity: 0.8;
        fill: currentColor;
    }
</style>
