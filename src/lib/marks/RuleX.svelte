<script lang="ts">
    import type { Figure } from '$lib/classes/Figure.svelte';
    import type { BaseMarkProps, RuleXMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';
    import getBaseStyles from '$lib/helpers/getBaseStyles';
    import resolveChannel from '$lib/helpers/resolveChannel';

    const BaseMark_RuleX = BaseMark<BaseMarkProps & RuleXMarkProps>;

    const figure = getContext<Figure>('svelteplot');

    let { data = [], x, y1, y2, ...styleProps } = $props<RuleXMarkProps>();

    let dataWrapped = $derived(x ? data : data.map((d) => ({ x: d, ___orig___: d })));
</script>

<BaseMark_RuleX type="rule-x" data={dataWrapped} channels={['x', 'y']} {x} {y1} {y2}>
    <g class="rule-x">
        {#each data as datum}
            <line
                transform="translate({figure.xScale(resolveChannel('x', datum, x))}, {0})"
                style={getBaseStyles(datum, styleProps)}
                y1={y1 != null ? figure.yScale(resolveChannel('y', datum, y1)) : figure.margins.top}
                y2={y2 != null
                    ? figure.yScale(resolveChannel('y', datum, y2))
                    : figure.plotHeight + figure.margins.top}
            />
        {/each}
    </g>
</BaseMark_RuleX>

<style>
    .rule-x line {
        stroke: currentColor;
    }
</style>
