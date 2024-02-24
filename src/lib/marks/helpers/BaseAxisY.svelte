<script lang="ts">
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import { resolveProp } from '$lib/helpers/resolve.js';
    import type { ConstantAccessor, PlotState, RawValue, ScaleType } from '$lib/types.js';
    import { tick } from 'svelte';

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

    let positionedTicks = $derived.by(() => {
        let tickObjects = ticks.map((tick, i) => {
            return {
                value: tick,
                hidden: false,
                dx: +resolveProp(options.dx, tick, 0),
                dy: +resolveProp(options.dy, tick, 0),
                y: scaleFn(tick) + (scaleType === 'band' ? scaleFn.bandwidth() * 0.5 : 0),
                text: tickFormat(tick)
            };
        });
        const T = tickObjects.length;
        for (let i = 0; i < T; i++) {
            let j = i;
            // find the preceeding tick that was not hidden
            do {
                j--;
            } while (j >= 0 && tickObjects[j].hidden);
            if (j >= 0) {
                const tickLabelSpace = Math.abs(tickObjects[i].y - tickObjects[j].y);
                tickObjects[i].hidden = tickLabelSpace < 15;
            }
        }
        return tickObjects;
    });
</script>

<g class="axis-y">
    {#each positionedTicks as tick, t}
        {#if !tick.hidden}
            <g
                class="tick"
                transform="translate({tick.dx +
                    marginLeft +
                    (anchor === 'left' ? 0 : width)},{tick.y + tick.dy})"
            >
                {#if tickSize}
                    <line
                        style={getBaseStyles(tick.value, options)}
                        x2={anchor === 'left' ? -tickSize : tickSize}
                    />
                {/if}
                <text
                    class:is-left={anchor === 'left'}
                    style={getBaseStyles(tick.value, { ...options, fontSize: tickFontSize })}
                    x={(tickSize + tickPadding) * (anchor === 'left' ? -1 : 1)}
                    dominant-baseline={LINE_ANCHOR[lineAnchor]}
                    >{Array.isArray(tick.text) ? tick.text.join(' ') : tick.text}</text
                >
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
    text.is-left {
        text-anchor: end;
    }
</style>
