<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { AxisYMarkProps, BaseMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import { get } from 'underscore';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    
    const BaseMark_AxisX = BaseMark<BaseMarkProps & AxisYMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let {
        ticks = [],
        anchor = 'left',
        automatic = false,
        tickSize = 6,
        tickPadding = 3,
        title = null,
        tickFormat = (d) => String(d),
        tickFontSize = null,
        fill = null,
        ...styleProps
    } = $props<AxisYMarkProps>();

    let autoTickCount = $derived(plot.plotHeight / get(plot, 'options.y.tickSpacing', 80));

    let autoTicks = $derived(
        ticks.length > 0 ? ticks : get(plot, 'options.y.ticks', plot.yScale.ticks(autoTickCount))
    );

    let optionsLabel = $derived(get(plot, 'options.y.label'));
    let useTitle = $derived(
        title ||
            (optionsLabel === null
                ? null
                : optionsLabel === undefined
                  ? plot.y.autoTitle
                  : optionsLabel)
    );
</script>

<BaseMark_AxisX type="axis-y" data={ticks} channels={['y']} {automatic}>
    <g class="axis-y">
        {#if useTitle}
            <text x={0} y={5} class="axis-title" dominant-baseline="hanging">↑ {useTitle}</text>
        {/if}
        {#each autoTicks as tick}
            <g
                class="y-tick"
                transform="translate({plot.margins.left +
                    (anchor === 'left' ? 0 : plot.plotWidth)},{plot.yScale(tick)})"
            >
                <text
                    class:is-left={anchor === 'left'}
                    style={getBaseStyles(tick, { fill, fontSize: tickFontSize })}
                    x={(tickSize + tickPadding) * (anchor === 'left' ? -1 : 1)}
                    dominant-baseline="middle">{tickFormat(tick)}</text
                >
                <line
                    style={getBaseStyles(tick, styleProps)}
                    x2={anchor === 'left' ? -tickSize : tickSize}
                />
            </g>
        {/each}
    </g>
</BaseMark_AxisX>

<style>
    text {
        font-size: 11px;
        fill: #4a4a4a;
    }
    text.is-left {
        text-anchor: end;
    }
    text.axis-title {
        text-anchor: start;
    }
    .y-tick line {
        stroke: currentColor;
    }
</style>
