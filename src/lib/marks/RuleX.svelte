<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, RuleXMarkProps } from '$lib/types.js';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import resolveChannel from '$lib/helpers/resolveChannel.js';

    const BaseMark_RuleX = BaseMark<BaseMarkProps & RuleXMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data = [], x, y1, y2, ...styleProps } = $props<RuleXMarkProps>();

    let dataWrapped = $derived(x ? data : data.map((d) => ({ x: d, ___orig___: d })));
</script>

<BaseMark_RuleX type="rule-x" data={dataWrapped} channels={['x', 'y']} {x} {y1} {y2}>
    <g class="rule-x">
        {#each data as datum}
            <line
                transform="translate({plot.xScale(resolveChannel('x', datum, x))}, {0})"
                style={getBaseStyles(datum, styleProps)}
                y1={y1 != null ? plot.yScale(resolveChannel('y', datum, y1)) : plot.margins.top}
                y2={y2 != null
                    ? plot.yScale(resolveChannel('y', datum, y2))
                    : plot.plotHeight + plot.margins.top}
            />
        {/each}
    </g>
</BaseMark_RuleX>

<style>
    .rule-x line {
        stroke: currentColor;
    }
</style>
