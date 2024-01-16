<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import type { BaseMarkProps, TickMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';

    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';

    const BaseMark_TickX = BaseMark<BaseMarkProps & TickMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data = [], ...channels } = $props<TickMarkProps>();
</script>

<BaseMark_TickX type="tick-x" {data} channels={['x', 'y', 'stroke']} {...channels}>
    <g class="tick-x">
        {#each data as datum}
            <line
                transform="translate({plot.xScale(resolveChannel('x', datum, channels))}, {0})"
                style:stroke={channels.stroke
                    ? plot.colorScale(resolveChannel('stroke', datum, channels))
                    : null}
                style={getBaseStyles(datum, channels)}
                y1={plot.yScale(resolveChannel('y', datum, channels))}
                y2={plot.yScale(resolveChannel('y', datum, channels)) + plot.yScale.bandwidth()}
            />
        {/each}
    </g>
</BaseMark_TickX>

<style>
    .tick-x line {
        stroke: currentColor;
    }
</style>
