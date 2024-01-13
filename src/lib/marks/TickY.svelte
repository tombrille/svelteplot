<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, TickMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';

    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';

    const BaseMark_TickY = BaseMark<BaseMarkProps & TickMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data = [], ...channels } = $props<TickMarkProps>();
</script>

<BaseMark_TickY type="tick-y" {data} channels={['x', 'y', 'stroke']} {...channels}>
    <g class="tick-y">
        {#each data as datum}
            <line
                transform="translate(0, {plot.yScale(resolveChannel('y', datum, channels))})"
                style:stroke={channels.stroke
                    ? plot.colorScale(resolveChannel('stroke', datum, channels))
                    : null}
                style={getBaseStyles(datum, channels)}
                x1={plot.xScale(resolveChannel('x', datum, channels))}
                x2={plot.xScale(resolveChannel('x', datum, channels)) + plot.xScale.bandwidth()}
            />
        {/each}
    </g>
</BaseMark_TickY>

<style>
    .tick-y line {
        stroke: currentColor;
    }
</style>
