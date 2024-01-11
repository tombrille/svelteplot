<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, RuleYMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';

    const BaseMark_RuleY = BaseMark<BaseMarkProps & RuleYMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data = [], ...channels } = $props<RuleYMarkProps>();

    let { y, x1, x2 } = $derived(channels);

    let dataWrapped = $derived(y ? data : data.map((d) => ({ __y: d, ___orig___: d })));
</script>

<BaseMark_RuleY
    type="rule-y"
    data={dataWrapped}
    channels={['y', 'x1', 'x2']}
    {...{ y: '__y', ...channels }}
>
    <g class="rule-y">
        {#each data as datum}
            <line
                transform="translate(0,{plot.yScale(resolveChannel('y', datum, channels))})"
                style={getBaseStyles(datum, channels)}
                x1={x1 != null
                    ? plot.xScale(resolveChannel('x1', datum, channels))
                    : plot.margins.left}
                x2={x2 != null
                    ? plot.xScale(resolveChannel('x2', datum, channels))
                    : plot.plotWidth + plot.margins.left}
            />
        {/each}
    </g>
</BaseMark_RuleY>

<style>
    .rule-y line {
        stroke: currentColor;
    }
</style>
