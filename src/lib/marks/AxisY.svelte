<script lang="ts">
    import type { Figure } from '$lib/classes/Figure.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import type { AxisYMArkProps, BaseMarkProps, GridYMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';

    const BaseMark_AxisX = BaseMark<BaseMarkProps & AxisYMArkProps>;

    const figure = getContext<Figure>('svelteplot');

    let {
        data = [],
        anchor = 'left',
        automatic = false,
        tickSize = 6,
        tickPadding = 3,
        title = null,
        tickFormat = (d) => String(d),
        tickFontSize = null,
        ...styleProps
    } = $props<AxisYMArkProps>();

    let ticks = $derived(
        data.length > 0
            ? data
            : figure.yScale.ticks(
                  Math.ceil(figure.plotHeight / (figure.options.y.autoTickDist || 80))
              )
    );

    let autoTitle = $derived(
        figure.y.activeMarks.length === 1 && typeof figure.y.activeMarks[0].props.y === 'string'
            ? figure.y.activeMarks[0].props.y
            : null
    );
    let useTitle = $derived(title || autoTitle);
</script>

<BaseMark_AxisX type="axis-y" {data} channels={data.length ? ['y'] : []} {automatic}>
    <g class="axis-y">
        {#if useTitle}
            <text x={0} y={5} class="axis-title" dominant-baseline="hanging">↑ {useTitle}</text>
        {/if}
        {#each ticks as tick}
            <g
                class="y-tick"
                transform="translate({figure.margins.left +
                    (anchor === 'left' ? 0 : figure.plotWidth)},{figure.yScale(tick)})"
            >
                <text
                    class:is-left={anchor === 'left'}
                    style={getBaseStyles(tick, { fontSize: tickFontSize })}
                    x={(tickSize + tickPadding) * (anchor === 'left' ? -1 : 1)}
                    dominant-baseline="middle">{tickFormat(tick)}</text
                >
                <line x2={anchor === 'left' ? -tickSize : tickSize} />
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
