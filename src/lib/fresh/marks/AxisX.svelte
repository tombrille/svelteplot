<script lang="ts">
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
    import { resolveChannel } from '../helpers/resolve.js';
    import autoTimeFormat from '$lib/helpers/autoTimeFormat.js';
    import dayjs from 'dayjs';
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

    const { state } = getContext<PlotContext>('svelteplot');
    let plot = $derived(state());

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

    let useTickFormat = $derived(
        typeof tickFormat === 'function'
            ? tickFormat
            : plot.scales.x.type === 'time'
              ? typeof tickFormat === 'string'
                  ? (d: Date) =>
                        dayjs(d)
                            .format(tickFormat as string)
                            .split('\n')
                  : autoTimeFormat(plot.scales.x, plot.plotWidth)
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
            {@const textLines = tickTexts[t]}
            {@const prevTextLines = t && tickTexts[t - 1]}
            {@const x =
                plot.scales.x.fn(tick) +
                (plot.scales.x.type === 'band' ? plot.scales.x.fn.bandwidth() * 0.5 : 0)}
            <g
                class="tick"
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
