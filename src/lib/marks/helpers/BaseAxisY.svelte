<script lang="ts">
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveProp } from '$lib/helpers/resolve.js';
    import type { ConstantAccessor, PlotState, RawValue, ScaleType } from '$lib/types.js';

    let {
        scaleFn,
        scaleType,
        ticks,
        tickFormat,
        anchor,
        lineAnchor,
        tickSize,
        tickPadding,
        tickFontSize,
        marginLeft,
        width,
        options,
        plot
    } = $props<{
        scaleFn: (d: RawValue) => number;
        scaleType: ScaleType;
        ticks: RawValue[];
        tickFormat: (d: RawValue) => string | string[];
        anchor: 'left' | 'right';
        lineAnchor: 'top' | 'center' | 'bottom';
        tickSize: number;
        tickPadding: number;
        tickFontSize: ConstantAccessor<number>;
        marginLeft: number;
        width: number;
        options: {
            dx: ConstantAccessor<number>;
            dy: ConstantAccessor<number>;
        };
        plot: PlotState;
    }>();

    const LINE_ANCHOR = {
        top: 'hanging',
        center: 'middle',
        bottom: 'auto'
    };
</script>

<g class="axis-y">
    {#each ticks as tick, t}
        {@const tickText = tickFormat(tick)}
        {@const dx = resolveProp(options.dx, tick, 0)}
        {@const dy = resolveProp(options.dy, tick, 0)}
        {@const y = scaleFn(tick) + (scaleType === 'band' ? scaleFn.bandwidth() * 0.5 : 0)}
        <g
            class="tick"
            transform="translate({dx + marginLeft + (anchor === 'left' ? 0 : width)},{y + dy})"
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
