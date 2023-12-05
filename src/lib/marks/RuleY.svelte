<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import type { BaseMarkProps, RuleYMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';
    import resolveChannel from '$lib/helpers/resolveChannel';
    import wrapArray from '$lib/helpers/wrapArray';

    const BaseMark_RuleY = BaseMark<BaseMarkProps & RuleYMarkProps>;

    const plot = getContext<Plot>('svelteplot');

    let { data = [], y, x1, x2, ...styleProps } = $props<RuleYMarkProps>();

    let dataWrapped = $derived(y ? data : data.map((d) => ({ y: d, ___orig___: d })));
</script>

<BaseMark_RuleY type="rule-y" data={dataWrapped} channels={['y', 'x']} {y} {x1} {x2}>
    <g class="rule-y">
        {#each data as datum}
            <line
                transform="translate(0,{plot.yScale(resolveChannel('y', datum, y))})"
                style={getBaseStyles(datum, styleProps)}
                x1={x1 != null ? plot.xScale(resolveChannel('x', datum, x1)) : plot.margins.left}
                x2={x2 != null
                    ? plot.xScale(resolveChannel('x', datum, x2))
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
