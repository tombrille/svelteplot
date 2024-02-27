<script lang="ts">
    // this component only takes care of rendering the x axis so we can re-use it
    // for the facet labels

    import removeIdenticalLines from '$lib/helpers/removeIdenticalLines.js';
    import type { ChannelAccessor, ConstantAccessor, PlotState, RawValue, ScaleType } from '$lib/types.js';
    import { resolveScaledStyles, resolveProp } from '$lib/helpers/resolve.js';
    import { max } from 'd3-array';
    import { testFilter } from '$lib/helpers/index.js';

    let {
        scaleFn,
        scaleType,
        ticks,
        tickFormat,
        anchor,
        tickSize,
        tickPadding,
        tickFontSize,
        marginTop,
        height,
        options,
        plot
    } = $props<{
        scaleFn: (d: RawValue) => number;
        scaleType: ScaleType;
        ticks: RawValue[];
        tickFormat: (d: RawValue) => string | string[];
        anchor: 'top' | 'bottom';
        tickSize: number;
        tickPadding: number;
        tickFontSize: ConstantAccessor<number>;
        marginTop: number;
        height: number;
        options: {
            dx: ConstantAccessor<number>;
            dy: ConstantAccessor<number>;
            filter: ChannelAccessor;
        };
        plot: PlotState;
    }>();

    function splitTick(tick: string | string[]) {
        return Array.isArray(tick) ? tick : [tick];
    }

    let formattedTicks = $derived(
        removeIdenticalLines(
            ticks.map((tick) => ({
                value: tick,
                text: splitTick(tickFormat(tick))
            }))
        )
    );

    let tickRotate = $derived(plot.options.x.tickRotate || 0);

    let tickY = $derived(anchor === 'bottom' ? marginTop + height : marginTop);

    let isQuantitative = $derived(scaleType !== 'point' && scaleType !== 'band');
</script>

<g class="axis-x">
    {#each formattedTicks as tick, t}
        {#if testFilter(tick.value, options)}
            {@const x = scaleFn(tick.value) + (scaleType === 'band' ? scaleFn.bandwidth() * 0.5 : 0)}
            {@const nextX =
                t < formattedTicks.length - 1
                    ? scaleFn(formattedTicks[t + 1].value) +
                    (scaleType === 'band' ? scaleFn.bandwidth() * 0.5 : 0)
                    : null}
            {@const tickLabelSpace = Math.abs(nextX - x)}
            {@const textLines = tick.text}
            {@const dx = +resolveProp(options.dx, tick, 0)}
            {@const dy = +resolveProp(options.dy, tick, 0)}
            {@const prevTextLines = t && formattedTicks[t - 1].text}
            {@const estLabelWidth =
                max(textLines.map((t) => t.length)) * resolveProp(tickFontSize, tick) * 0.2}
            {@const moveDown = (tickSize + tickPadding) * (anchor === 'bottom' ? 1 : -1)}
            <g
                class="tick"
                transform="translate({x + dx}, {tickY + dy})"
                text-anchor={tickRotate < 0 ? 'end' : tickRotate > 0 ? 'start' : 'middle'}
            >
                {#if tickSize}
                    <line
                        style={resolveScaledStyles(tick, options, {}, plot, 'stroke')}
                        y2={anchor === 'bottom' ? tickSize : -tickSize}
                    />
                {/if}

                <text
                    transform="rotate({tickRotate})"
                    style:font-variant={isQuantitative ? 'tabular-nums' : 'normal'}
                    style={resolveScaledStyles(
                        tick,
                        { ...options, fontSize: tickFontSize, stroke: null },
                        {},
                        plot,
                        'fill'
                    )}
                    x={tickRotate < 0 ? -moveDown : tickRotate > 0 ? moveDown : 0}
                    y={tickRotate !== 0 ? '-0.35rem' : moveDown}
                    dominant-baseline={anchor === 'bottom' ? 'hanging' : 'auto'}
                >
                    {#if ticks.length > 0 || t === 0 || t === ticks.length - 1 || tickLabelSpace >= estLabelWidth * 2}
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
        {/if}
    {/each}
</g>

<style>
    line {
        stroke: currentColor;
    }
    text {
        font-size: 11px;
        opacity: 0.8;
        fill: currentColor;
    }
</style>
