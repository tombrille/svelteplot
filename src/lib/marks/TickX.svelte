<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type {
        BaseMarkProps,
        TickXMarkProps,
        ChannelName,
        ChannelAccessor
    } from '$lib/types.js';
    import { getContext } from 'svelte';

    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';

    const BaseMark_TickX = BaseMark<BaseMarkProps & TickXMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data = [], ...channels } = $props<TickXMarkProps>();

    let { x, y } = $derived(channels);

    let dataWrapped = $derived(x ? data : data.map((d) => ({ x: d, ___orig___: d })));
</script>

<BaseMark_TickX
    type="tick-x"
    data={dataWrapped}
    channels={['x', 'y']}
    {...{ x: 'x', ...channels }}
>
    <g class="tick-x">
        {#each data as datum}
            <line
                transform="translate({plot.xScale(resolveChannel('x', datum, channels))}, {0})"
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
