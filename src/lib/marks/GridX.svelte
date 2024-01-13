<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type {
        BaseMarkProps,
        GridXMarkProps,
        GridOptions,
        ChannelAccessor,
        ChannelName
    } from '$lib/types.js';
    import { getContext } from 'svelte';
    import { get } from 'underscore';

    import BaseMark from './BaseMark.svelte';
    import resolveChannel from '$lib/helpers/resolveChannel.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';

    const BaseMark_GridX = BaseMark<BaseMarkProps & GridXMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { ticks = [], automatic = false, ...channels } = $props<GridXMarkProps & GridOptions>();

    let autoTickCount = $derived(
        Math.max(2, Math.round(plot.plotWidth / (plot.options?.x?.tickSpacing || 80)))
    );
    $inspect(autoTickCount);

    let autoTicks = $derived(
        ticks.length > 0 ? ticks : get(plot, 'options.x.ticks', plot.xScale.ticks(autoTickCount))
    );

    let { y1, y2 } = $derived(channels);
</script>

<BaseMark_GridX
    type="grid-x"
    data={ticks.length ? ticks.map((tick) => ({ __x: tick })) : undefined}
    channels={['y']}
    x="__x"
    {...channels}
    {automatic}
>
    <g class="grid-x">
        {#each autoTicks as tick}
            <g
                class="x-tick"
                transform="translate({plot.xScale(tick) +
                    (plot.xScale.bandwidth ? plot.xScale.bandwidth() * 0.5 : 0)},{plot.margins
                    .top})"
            >
                <line
                    class="grid"
                    style={getBaseStyles(tick, channels)}
                    y1={y1 ? plot.yScale(resolveChannel('y1', tick, channels)) : 0}
                    y2={y2
                        ? plot.yScale(resolveChannel('y2', tick, channels))
                        : plot.height - plot.margins.top - plot.margins.bottom}
                />
            </g>
        {/each}
    </g>
</BaseMark_GridX>

<style>
    .x-tick line.grid {
        stroke: currentColor;
        stroke-opacity: 0.1;
    }
</style>
